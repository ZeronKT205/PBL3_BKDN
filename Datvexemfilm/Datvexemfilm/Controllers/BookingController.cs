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
            var _booking = new Booking
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
            return Json(new { bookingid = _booking.Booking_ID, success = true }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult gettick()
        {
            var bookings = _dbContext.Bookings
                .Include("CustomerInfo")
                .Include("Show.Film")
                .Include("Show.Room")
                .Include("Order_Products.Product")
                .Include("SeatOrder.Seat")
                .ToList();

            var tickets = bookings.Select(b => new TicketViewModel
            {
                Name_User = b.CustomerInfo != null ? b.CustomerInfo.fullname : "",
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

            return Json(tickets, JsonRequestBehavior.AllowGet);
        }
    }
}
