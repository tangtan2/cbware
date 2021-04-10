using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using OrderUp.Models;
using OrderUp.Controllers.Routes;

namespace OrderUp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static byte[] NewSalt()
        {
            return HashFunction.DevSalt();
        }

        public static string EncodeSalt(byte[] salt)
        {
            return HashFunction.DevEncode(salt);
        }

        public static byte[] DecodeSalt(string saltString)
        {
            return HashFunction.DevDecode(saltString);
        }

        public static string ApplyHash(byte[] salt, string password)
        {
            return HashFunction.DevHash(salt, password);
        }

        [HttpGet]
        [Route("")]
        public string GetRoot()
        {
            return "You are at the user controller root page!";
        }

        [HttpGet]
        [Route("authenticate-verify")]
        public ActionResult<UserModel> GetAuthenticateAndVerifyWebSession([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return getAuthenticateAndVerifyWebSession.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("login")]
        public ActionResult<WebSessionModel> PostUserLogin([FromBody] PostUserLoginType data)
        {
            return postUserLogin.Execute(data, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("logout")]
        public ActionResult<WebSessionModel> PostUserLogout([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return postUserLogout.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("details")]
        public ActionResult<UserModel> GetUserDetails([FromHeader(Name = "X-websession")] Guid webSessionId)
        {
            return getUserDetails.Execute(webSessionId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpGet]
        [Route("all")]
        public ActionResult<List<UserModel>> GetAllUsers()
        {
            return getAllUsers.Execute(_configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("new")]
        public ActionResult<UserModel> PostNewUser([FromBody] PostNewUserType data)
        {
            return postNewUser.Execute(data, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("delete")]
        public ActionResult<UserModel> PostDeleteUser([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] Guid userId)
        {
            return postDeleteUser.Execute(webSessionId, userId, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("verify")]
        public ActionResult<UserModel> PostVerifyUser([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] PostVerifyUserType data)
        {
            return postVerifyUser.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("password/update")]
        public ActionResult<UserModel> PostUpdateUserPassword([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] PostUpdateUserPasswordType data)
        {
            return postUpdateUserPassword.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("password/reset")]
        public ActionResult<UserModel> PostResetUserPassword([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] PostResetUserPasswordType data)
        {
            return postResetUserPassword.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
        }

        [HttpPost]
        [Route("role/update")]
        public ActionResult<UserModel> PostUpdateUserRole([FromHeader(Name = "X-websession")] Guid webSessionId, [FromBody] PostUpdateUserRoleType data)
        {
            return postUpdateUserRole.Execute(webSessionId, data, _configuration["ConnectionStrings:DefaultConnection"]);
        }
    }
}