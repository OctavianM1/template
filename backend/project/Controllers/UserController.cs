using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Domain;
using project.Dtos;
using project.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly JwtManager _jwtManager;

        public UserController(ProjectContext context, JwtManager jwtManager)
        {
            _context = context;
            _jwtManager = jwtManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(CreateUserRequest user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser != null)
            {
                return BadRequest($"User with {user.Email} already exists");
            }
            //var hashedPassword = PasswordHashing.GenerateSaltedHash(Encoding.UTF8.GetBytes(user.Password), Convert.ToBase64String(inArray, 0, inArray.Length,
            //                    Base64FormattingOptions.InsertLineBreaks));
            var createdUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = user.Password
            };
            _context.Users.Add(createdUser);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.Password == request.Password);
            if (user == null)
            {
                var isEmail = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
                if (isEmail != null)
                {
                    return BadRequest(new { Password = "Password is incorrect" });
                }
                return BadRequest(new { Email = "Email does not exist" });

            }
            var userToken = _jwtManager.CreateToken(user.Email);
            var appUser = new AppUser
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Token = userToken
            };
            return Ok(appUser);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class CreateUserRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public static class PasswordHashing
    {
        public static byte[] GenerateSaltedHash(byte[] plainText, byte[] salt)
        {
            HashAlgorithm algorithm = new SHA256Managed();

            byte[] plainTextWithSaltBytes =
              new byte[plainText.Length + salt.Length];

            for (int i = 0; i < plainText.Length; i++)
            {
                plainTextWithSaltBytes[i] = plainText[i];
            }
            for (int i = 0; i < salt.Length; i++)
            {
                plainTextWithSaltBytes[plainText.Length + i] = salt[i];
            }

            return algorithm.ComputeHash(plainTextWithSaltBytes);
        }

        public static bool CompareByteArrays(byte[] array1, byte[] array2)
        {
            if (array1.Length != array2.Length)
            {
                return false;
            }

            for (int i = 0; i < array1.Length; i++)
            {
                if (array1[i] != array2[i])
                {
                    return false;
                }
            }

            return true;
        }

    }
}
