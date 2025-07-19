using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using ChatApp.Models;
using ChatApp.DTOs;
using ChatApp.Data;
using System.Linq;

namespace ChatApp.Services;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _hasher = new();

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public bool Register(RegisterDto dto, out string error)
    {
        error = string.Empty;

        if (_context.Users.Any(u => u.Email == dto.Email))
        {
            error = "Email is already taken";
            return false;
        }

        var user = new User
        {
            Email = dto.Email,
            Username = dto.Username,
        };

        user.Password = _hasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        _context.SaveChanges();

        return true;
    }

    public User? Authenticate(LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
        if (user == null) return null;

        var result = _hasher.VerifyHashedPassword(user, user.Password, dto.Password);
        return result == PasswordVerificationResult.Success ? user : null;
    }
    public async Task<User?> GetUserById(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<List<User>> GetAllUsers()
    {        
        return await _context.Users.ToListAsync();
    }
}