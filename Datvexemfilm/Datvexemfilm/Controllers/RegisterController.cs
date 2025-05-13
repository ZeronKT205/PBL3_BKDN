using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Controllers;

namespace MySimpleMvcApp.Controllers
{
    public class RegisterController : Controller
    {
        private readonly AppDbContext _dbContext;

        public RegisterController()
        {
            _dbContext = new AppDbContext(); 
        }
        [HttpPost]
        public JsonResult Register(RegisterRequest req)
        {
            var q = _dbContext.Accounts.FirstOrDefault(x => x.Username == req.Username);
            var p = _dbContext.Accounts.FirstOrDefault(x => x.Email == req.Email);

            if (q != null)
            {
                return Json(new { success = false, message = "Tài khoản đã tồn tại" });
            }
            else if (p != null)
            {
                return Json(new { success = false, message = "Email đã tồn tại" });
            }
            else
            {
                var newAccount = new Account
                {
                    Username = req.Username,
                    Password = req.Password,
                    Email = req.Email,
                    Role = "user",
                    Status = "Normal"
                };
                _dbContext.Accounts.Add(newAccount);
                _dbContext.SaveChanges();
                return Json(new { success = true, message = "Đăng ký thành công!" });
            }
        }
    }
}
