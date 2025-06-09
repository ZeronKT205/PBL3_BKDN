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

            var tickets = bookings.Where(b=>b.Status=="Finish").Select(b => new TicketViewModel
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
        [HttpPost]
        public JsonResult Booking_Ticked(int id_show, int user_id, int total)
        {
            var _show = _dbContext.Shows.FirstOrDefault(s => s.Show_ID == id_show);
            var booking = new Booking
            {
                User_ID = user_id,
                Show_ID = id_show,
                Booking_Date = DateTime.Now,
                Status = "ON",
                total = total
            };
            _dbContext.Bookings.Add(booking);
            _dbContext.SaveChanges();
            return Json(new { success = true });
        }
        [HttpPost]
        public JsonResult Report(DateTime start, DateTime end)
        {
            var tmp = _dbContext.Bookings
                .Include("Show")
                .Where(s => s.Booking_Date >= start && s.Booking_Date <= end&&s.Status=="Finish")
                .ToList();

            var mostBookedFilm = _dbContext.Bookings
                .Include("Show")
                .Include("Show.Film")
                .Where(b => b.Booking_Date >= start && b.Booking_Date <= end&&b.Status == "Finish")
                .GroupBy(b => b.Show.Film.ID_Movie)
                .Select(g => new
                {
                    FilmId = g.Key,
                    FilmName = g.FirstOrDefault().Show.Film.name,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .FirstOrDefault();

            var mostBookedScreen = _dbContext.Bookings
                .Include("Show")
                .Include("Show.Room")
                .Where(b => b.Booking_Date >= start && b.Booking_Date <= end&& b.Status == "Finish")
                .GroupBy(b => b.Show.Room_ID)
                .Select(g => new
                {
                    RoomId = g.Key,
                    RoomName = g.FirstOrDefault().Show.Room.Room_Name,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .FirstOrDefault();

            var report = new
            {
                totalamount = tmp.Sum(s => s.total),
                count = tmp.Count,
                mostBookedFilm = mostBookedFilm != null ? new
                {
                    name = mostBookedFilm.FilmName,
                    count = mostBookedFilm.Count
                } : null,
                mostBookedScreen = mostBookedScreen != null ? new
                {
                    name = mostBookedScreen.RoomName,
                    count = mostBookedScreen.Count
                } : null
            };

            return Json(report, JsonRequestBehavior.AllowGet);
        }
        public ActionResult bookingTicket()
        {
            return View();
        }
        public ActionResult historyBooking()
        {
            return View();
        }
    }
}
