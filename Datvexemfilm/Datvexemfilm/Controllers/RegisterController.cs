using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Controllers;
using Datvexemfilm.Models;
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
            if (req.Username == null || req.Password == null || req.Email == null)
            {
                return Json(new { success = false, message = "Input is not valid!" });
            }
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

                var customer = new CustomerInfo
                {
                    User_ID=newAccount.User_ID,
                    fullname = "",
                    Birthday = null,      // nếu có truyền từ client
                    Gender = "",          // nếu có truyền từ client
                    Phone = "",
                    Address = "",
                    Email = req.Email             // trùng với email của Account
                };
                _dbContext.customerInfos.Add(customer);
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Đăng ký thành công!" });

            }
        }
    }
}