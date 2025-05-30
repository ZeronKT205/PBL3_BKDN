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
            return email;
        }
        public ActionResult Payment_Booking(int user_id,int show_id,int room_id,string seat,string total,int bookingid)
        {
             var _show = _dbContext.Shows.Include("Film").FirstOrDefault(s => s.Show_ID == show_id);
            var _room = _dbContext.Rooms.FirstOrDefault(r => r.Room_ID == room_id);
            var tmp = new _Payment
            {
                Name = _show.Film.name,
                Day = _show.Day,
                Start = _show.Start_Movie,
                Price_Show = _show.Price,
                Seat = seat,
                Total = total,
                Email = getemail(user_id),
                Room_Name = _room.Room_Name,
                Room_ID = room_id,
                Show_ID = show_id,
                Booking_ID = bookingid
            };
            return View("~/Views/Home/Payment.cshtml",tmp);
        }
        [HttpPost]
        public JsonResult addPayment(int Booking_ID, int Amount)
        {
            var booking = _dbContext.Bookings
                .Include(b => b.SeatOrder)
                .FirstOrDefault(b => b.Booking_ID == Booking_ID);

            if (booking == null || booking.SeatOrder == null)
                return Json(new { success = false, message = "Không tìm thấy booking hoặc seat order." });

            var seatOrder = booking.SeatOrder;

            var seat = _dbContext.Seats.FirstOrDefault(s => s.Seat_ID == seatOrder.Seat_ID);
            if (seat == null)
                return Json(new { success = false, message = "Không tìm thấy seat." });
            if (string.IsNullOrEmpty(seat.Booked))
                seat.Booked = seatOrder.Choice;
            else
                seat.Booked += "," + seatOrder.Choice;

            var payment = new Payment
            {
                Booking_ID = Booking_ID,
                Amount = Amount,
                Created_On = DateTime.Now,
                Detail = "Thanh toan VNPAY"
            };
            _dbContext.payments.Add(payment);

            booking.total = Amount;
            booking.Status = "Finish";

            _dbContext.SaveChanges();

            return Json(new { success = true });
        }

    }
}