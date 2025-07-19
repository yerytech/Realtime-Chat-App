using ChatApp.Hubs;
using ChatApp.Services;
using ChatApp.Data; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.IdentityModel.Logging;


var builder = WebApplication.CreateBuilder(args);
IdentityModelEventSource.ShowPII = true; // Para debug de errores JWT

// Configuracion de dbcontext 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

// Configuracion autenticación JWT con soporte para SignalR
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false; // En producción debe ser true
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateAudience = true,
        };
        options.Events = new JwtBearerEvents
        {
            // Para que SignalR pueda obtener el token desde la query string
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/chatHub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Token inválido: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token válido");
                return Task.CompletedTask;
            }
        };
    });

// Configuracion CORS para permitir frontend React (puerto 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// Middleware para debug token en consola
app.Use(async (context, next) =>
{
    var rawToken = context.Request.Headers["Authorization"].ToString();

    // Quita el prefijo "Bearer " si está presente
    var token = rawToken.StartsWith("Bearer ") ? rawToken.Substring("Bearer ".Length) : rawToken;

    Console.WriteLine($"Token limpio: {token}");
    await next();
});

// Middleware pipeline (orden importante)
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Mapear rutas y hubs
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
