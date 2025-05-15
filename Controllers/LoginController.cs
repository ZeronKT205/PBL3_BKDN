using System;
using System.Linq;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class LoginController : Controller
    {
        private readonly AppDbContext _dbContext;

        public LoginController()
        {
            _dbContext = new AppDbContext();
        }

        [HttpPost]
        public JsonResult Login(string Username, string Password)
        {
            try
            {
                if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
                {
                    return Json(new { success = false, message = "Tên đăng nhập hoặc mật khẩu không được để trống" });
                }
                var user = _dbContext.Accounts.FirstOrDefault(x => x.Username == Username);
                if (user == null)
                {
                    return Json(new { success = false, message = "Tài khoản không tồn tại" });
                }
                if (user.Password != Password)
                {
                    return Json(new { success = false, message = "Mật khẩu không đúng" });
                }
                if (user.Status == "Ban")
                {
                    return Json(new { success = false, message = "Tài khoản đã bị khóa" });
                }
                else

                { 
                   return Json(new {id=user.ID,username=user.Username,email=user.Email, success = true, message = "Đăng nhập thành công", role = user.Role }); 
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi bất ngờ
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.", error = ex.Message });
            }
        }
    }
}