using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Models;
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
                user.ID,
                user.Username,
                user.Email,
                user.Status,
                user.Role
            }).ToList();
            return Json(users, JsonRequestBehavior.AllowGet); 
        }

        [HttpPost]
        public JsonResult GetUserbyID(int id)
        {
            var user = _dbContext.customerInfos.Where(p => p.ID == id).FirstOrDefault();
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteUser(int id)
        {
            try
            {
                // Kiểm tra xem user có tồn tại không
                var user = _dbContext.Accounts.Find(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy người dùng!" }, JsonRequestBehavior.AllowGet);
                }

                // Kiểm tra xem user có phải là admin không
                if (user.Role.ToLower() == "admin")
                {
                    return Json(new { success = false, message = "Không thể xóa tài khoản admin!" }, JsonRequestBehavior.AllowGet);
                }

                // Xóa user
                _dbContext.Accounts.Remove(user);
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Xóa người dùng thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi xóa người dùng: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
