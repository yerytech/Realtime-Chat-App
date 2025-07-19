using System.Security.Claims;
using ChatApp.DTOs;
using Microsoft.AspNetCore.Mvc;
using ChatApp.Models;
using ChatApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace ChatApp.Controllers;


[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
  private readonly UserService _userService;

  public UsersController(UserService userService)
  {
    _userService = userService;
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetUserById(int id)
  {
    var user = await _userService.GetUserById(id);
    if (user == null)
      return NotFound("User not found");

    return Ok(user);
  }

  [HttpGet]
  public async Task<IActionResult> GetAllUsers()
  {
    var currentUserIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value.ToString();
    if (string.IsNullOrEmpty(currentUserIdString))
      return Unauthorized(" NoToken provided or invalid token");
    var result = await _userService.GetAllUsers();

    var users = result.Select(u => new UserDto
    {
      Id = u.Id,
      Username = u.Username,
      Email = u.Email
    }).ToList();
    
    if (users == null || !users.Any())
      return NotFound("No users found");
      var resp= users.Where(u => u.Id.ToString() != currentUserIdString).ToList();
    return Ok(new
    {
      data = resp,
      length = resp.Count
    });
  }
  
}