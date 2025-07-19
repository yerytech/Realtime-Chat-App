using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using ChatApp.Models;
using ChatApp.Data;
using ChatApp.Hubs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ChatApp.DTOs;

namespace ChatApp.Controllers
{  
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] //con esto necesita token
    public class MessageController : ControllerBase
    {    
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _chatHub;

        public MessageController(AppDbContext context, IHubContext<ChatHub> chatHub)
        {
            _context = context;
            _chatHub = chatHub;
        }
 
        [HttpGet("all")]
        public IActionResult GetMessages()
        {
            var messages = _context.Messages
                .OrderBy(message => message.Content)
                .ToList();
            return Ok( new 
            {
                data = messages,
                length = messages.Count
            });
        }
[HttpPost("{id}")]
public async Task<IActionResult> PostMessage(int id, [FromBody] SendMessageDto dto)
{
    var currentUserIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (!int.TryParse(currentUserIdString, out var currentUserId))
        return Unauthorized("Invalid token");

    if (string.IsNullOrWhiteSpace(dto.Content))
        return BadRequest("Content is required");

    var message = new Message
    {
        SenderId = currentUserId,
        ReceiverId = id,
        Content = dto.Content,
        Date = DateTime.UtcNow
    };

    _context.Messages.Add(message);
    await _context.SaveChangesAsync();

    var fullMessage = _context.Messages
        .Include(m => m.Sender)
        .FirstOrDefault(m => m.Id == message.Id);

    if (fullMessage == null || fullMessage.Sender == null)
        return NotFound("Message not found after saving");

    await _chatHub.Clients
        .User(id.ToString())
        .SendAsync("ReceiveMessage", fullMessage);

    return Ok(new
    {
        fullMessage.Id,
        fullMessage.Content,
        fullMessage.Date,
        Sender = new
        {
            fullMessage.Sender.Id,
            fullMessage.Sender.Username,
            fullMessage.Sender.Email
        }
    });
}
[HttpGet("chat/{contactId}")]
public IActionResult GetMessagesWithContact(int contactId)
{
    var currentUserIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(currentUserIdString) || !int.TryParse(currentUserIdString, out var currentUserId))
        return Unauthorized();

    var messages = _context.Messages
        .Include(m => m.Sender)
        .Include(m => m.Receiver)
        .Where(m =>
            (m.SenderId == currentUserId && m.ReceiverId == contactId) ||
            (m.SenderId == contactId && m.ReceiverId == currentUserId))
        .OrderBy(m => m.Date)
        .Select(m => new
        {
            m.Id,
            m.Date,
            m.Content,
            Sender = new { m.Sender.Id, m.Sender.Username, m.Sender.Email },
            Receiver = new { m.Receiver.Id, m.Receiver.Username, m.Receiver.Email }
        })
        .ToList();

    return Ok(new { data = messages, length = messages.Count });
}


       
    }
}
