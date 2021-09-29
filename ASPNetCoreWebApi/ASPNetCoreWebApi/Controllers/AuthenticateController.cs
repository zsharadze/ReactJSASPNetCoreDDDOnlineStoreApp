using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ASPNetCoreWebApi.Models;
using ASPNetCoreWebApi.Repositories;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace ASPNetCoreWebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var clims = new List<Claim>() {
                    new Claim("Email", user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                };

                foreach (var role in userRoles)
                {
                    clims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    claims: clims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                    );

                string tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new
                {
                    Success = true,
                    UserEmail = user.Email,
                    Token = tokenAsString,
                    TokenExpiration = token.ValidTo,
                    UserRole = userRoles.First()
                });
            }
            return Ok(new
            {
                Success = false
            });
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!IsValidEmail(model.Email))
            {
                return Ok(new Response { Success = false, Message = "Invalid email address" });
            }

            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return Ok(new Response { Success = false, Message = "User already exists!" });

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email,
                RegistrationDate = DateTime.Now
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Success = false, Message = "User creation failed! Please check user details and try again." });

            if (!model.RegisterAsAdmin)
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }
            else
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Ok(new Response { Success = true, Message = "User created successfully!" });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (model.NewPassword != model.ConfirmPassword)
            {
                return Ok(new Response() { Success = false, Message = "Confirm password does not match." });
            }

            var user = await _userManager.FindByIdAsync(CurrentUserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var res = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (res.Succeeded)
            {
                return Ok(new Response() { Success = true, Message = "Password Changed Successfully." });
            }
            else
            {
                return Ok(new Response() { Success = false, Message = "Old password is incorrect." });
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public string CurrentUserId
        {
            get
            {
                return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }
    }
}
