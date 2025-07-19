using System.Security.Claims;
using ChatApp.DTOs;
using Microsoft.AspNetCore.Mvc;
using ChatApp.Models;
using ChatApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly  UserService  _userService;
    private readonly  TokenService  _toeknService;

    public AuthController( UserService userService,TokenService toeknService)
    {
        _userService=userService;
        _toeknService=toeknService;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        if(!_userService.Register(dto,out var error))
             return BadRequest(error);
        
        
        
        return Ok("user registered");
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {   
        
        var user = _userService.Authenticate(dto);
        if(user == null)
            return Unauthorized("Username or password is incorrect");
        var token=_toeknService.GenerateToken(user);
        return Ok(token);
    }
   
    


}

