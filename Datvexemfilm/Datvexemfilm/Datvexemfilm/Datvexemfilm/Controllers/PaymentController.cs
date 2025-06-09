using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class PaymentController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        public ActionResult Payment()
        {
            return View();
        }
        public string getemail(int user_id)
        {
            var email = _dbContext.Accounts.Where(a => a.User_ID == user_id).Select(a => a.Email).FirstOrDefault();
            return email ?? string.Empty; // Return empty string if email is null
        }
        public ActionResult Payment_Booking(int user_id, int show_id, int room_id, string seat, string total, int bookingid)
        {
            var _show = _dbContext.Shows.Include("Film").FirstOrDefault(s => s.Show_ID == show_id);
            var _room = _dbContext.Rooms.FirstOrDefault(r => r.Room_ID == room_id);
            
            // Create a default _Payment object with safe values
            var tmp = new _Payment
            {
                Name = _show?.Film?.name ?? "Unknown Movie",
                Day = _show?.Day ?? DateTime.Now,
                Start = _show?.Start_Movie ?? new TimeSpan(0, 0, 0),
                Price_Show = _show?.Price ?? 0,
                Seat = seat ?? string.Empty,
                Total = total ?? "0",
                Email = getemail(user_id),
                Room_Name = _room?.Room_Name ?? "Unknown Room",
                Room_ID = room_id,
                Show_ID = show_id,
                Booking_ID = bookingid
            };
            return View("~/Views/Home/Payment.cshtml", tmp);
        }
        [HttpPost]
        public JsonResult addPayment(int Booking_ID, int Amount)
        {
            try
            {
                var booking = _dbContext.Bookings
                    .Include(b => b.SeatOrder)
                    .FirstOrDefault(b => b.Booking_ID == Booking_ID);

                if (booking == null)
                    return Json(new { success = false, message = "Không tìm thấy booking." });

                if (booking.SeatOrder == null)
                    return Json(new { success = false, message = "Không tìm thấy seat order." });

                var seatOrder = booking.SeatOrder;
                if (seatOrder == null)
                    return Json(new { success = false, message = "Seat order không hợp lệ." });

                var seat = _dbContext.Seats.FirstOrDefault(s => s.Seat_ID == seatOrder.Seat_ID);
                if (seat == null)
                    return Json(new { success = false, message = "Không tìm thấy seat." });

                // Update seat booking status
                if (string.IsNullOrEmpty(seat.Booked))
                    seat.Booked = seatOrder.Choice ?? string.Empty;
                else
                    seat.Booked += "," + (seatOrder.Choice ?? string.Empty);

                // Create payment record
                var payment = new Payment
                {
                    Booking_ID = Booking_ID,
                    Amount = Amount,
                    Created_On = DateTime.Now,
                    Detail = "Thanh toan VNPAY"
                };
                _dbContext.payments.Add(payment);

                // Update booking status
                booking.total = Amount;
                booking.Status = "Finish";

                _dbContext.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }
    }
}