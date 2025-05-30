using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Models;
namespace Datvexemfilm.Controllers
{
    public class BookingController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();

        [HttpPost]
        public JsonResult Booking(Booking booking)
        {
            var _booking=new Booking
            {
                User_ID = booking.User_ID,
                Show_ID = booking.Show_ID,
                SeatOrder_ID = booking.SeatOrder_ID,
                total = booking.total,
                Booking_Date = DateTime.Now,
                Status = "ON"
            };
            _dbContext.Bookings.Add(_booking);
            _dbContext.SaveChanges();
            return Json(new { bookingid=_booking.Booking_ID,success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}
