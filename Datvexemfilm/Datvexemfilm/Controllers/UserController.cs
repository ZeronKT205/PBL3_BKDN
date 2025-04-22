using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MySimpleMvcApp.Controllers
{
    public class UserController : Controller
    {
        private readonly AppDbContext _dbContext;

        public UserController()
        {
            _dbContext = new AppDbContext(); 
        }

        [HttpGet]
        public JsonResult GetUsers()
        {
            var users = _dbContext.Accounts.Select(user => new
            {
                user.Username,
                user.Email,
                user.Status,
                user.Role
            }).ToList();

            return Json(users, JsonRequestBehavior.AllowGet); // Cho phép trả về JSON qua GET
        }
    }
}
