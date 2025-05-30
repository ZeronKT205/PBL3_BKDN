using System;
using System.Collections.Generic;
using System.Data.Entity;
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
                user.User_ID,
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

    }
}
