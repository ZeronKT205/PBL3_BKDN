using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Controllers;
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
            var users = _dbContext.Accounts.Where(s=>s.Status== "Normal"&&s.Role!="admin").Select(user => new
            {
                user.User_ID,
                user.Username,
                user.Email,
                user.Status,
                user.Role
            }).ToList();
            return Json(users, JsonRequestBehavior.AllowGet); 
        }

        [HttpGet]
        public JsonResult GetUserbyID(int id)
        {
            var user = _dbContext.customerInfos.Where(p => p.User_ID == id).FirstOrDefault();
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

                // Đánh dấu user là inactive thay vì xóa
                user.Status = "inactive";
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Vô hiệu hóa người dùng thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult history(int id_user)
        {
            var bookings = _dbContext.Bookings
                .Where(b => b.User_ID == id_user)
                .Include("Show.Film")
                .Include("Show.Room")
                .Include("Order_Products.Product")
                .Include("SeatOrder.Seat")
                .ToList();

            var tickets = bookings.Select(b => new TicketViewModel
            {
                Id = b.Booking_ID.ToString("D6"),
                Title = b.Show.Film.name,
                Status = b.Status,
                BookingDate = b.Booking_Date.ToString("dd/MM/yyyy"),
                Showtime = $"{b.Show.Day:dd/MM/yyyy} - {b.Show.Start_Movie:hh\\:mm}",
                Combo = b.Order_Products.Select(op => new TicketViewModel.ComboItem
                {
                    Name = op.Product.Name,
                    Quantity = op.quantity,
                    Price = string.Format("{0:N0}", op.Product.Price)
                }).ToList(),
                Price = string.Format("{0:N0} VNĐ", b.total),
                Poster = b.Show.Film.Poster,
                CinemaRoom = b.Show.Room.Room_Name,
                Seat = b.SeatOrder.Choice
            }).ToList();

            return Json(tickets,JsonRequestBehavior.AllowGet);
        }

        public ActionResult userlogin()
        {
            return View();
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
                    return Json(new { id = user.User_ID, username = user.Username, email = user.Email, success = true, message = "Đăng nhập thành công", role = user.Role });
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi bất ngờ
                return Json(new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.", error = ex.Message });
            }
        }
        public ActionResult usersignup()
        {
            return View();
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
                    Role = req.Role,
                    Status = "Normal"
                };
                _dbContext.Accounts.Add(newAccount);
                _dbContext.SaveChanges();

                var customer = new CustomerInfo
                {
                    User_ID = newAccount.User_ID,
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
        public ActionResult CustomerInfor()
        {
            return View();
        }

        [HttpPost]
        public JsonResult UpdateUserInfo(CustomerInfo customerInfo)
        {
            try
            {
                if (customerInfo == null || customerInfo.User_ID <= 0)
                {
                    return Json(new { success = false, message = "Thông tin không hợp lệ" });
                }

                var existingInfo = _dbContext.customerInfos.FirstOrDefault(u => u.User_ID == customerInfo.User_ID);
                if (existingInfo == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin người dùng" });
                }

                // Cập nhật thông tin
                existingInfo.fullname = customerInfo.fullname;
                existingInfo.Email = customerInfo.Email;
                existingInfo.Phone = customerInfo.Phone;
                existingInfo.Address = customerInfo.Address;
                existingInfo.Gender = customerInfo.Gender;
                existingInfo.Birthday = customerInfo.Birthday;

                // Cập nhật email trong bảng Account
                var account = _dbContext.Accounts.FirstOrDefault(a => a.User_ID == customerInfo.User_ID);
                if (account != null)
                {
                    account.Email = customerInfo.Email;
                }

                _dbContext.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult ChangePassword(int userId, string currentPassword, string newPassword)
        {
            try
            {

                var account = _dbContext.Accounts.FirstOrDefault(a => a.User_ID == userId);
                if (account == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin tài khoản" });
                }

                // Kiểm tra mật khẩu hiện tại
                if (account.Password != currentPassword)
                {
                    return Json(new { success = false, message = "Mật khẩu hiện tại không đúng" });
                }

                // Cập nhật mật khẩu mới
                account.Password = newPassword;
                _dbContext.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
