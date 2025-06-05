using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Management;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class TicketController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        public ActionResult seat_booking(int show_id, int room_id)
        {
            try
            {
                var _show = _dbContext.Shows.Include("Film").FirstOrDefault(s => s.Show_ID == show_id);
                if (_show == null)
                {
                    return HttpNotFound();
                }
                var _room = _dbContext.Rooms.Where(s => s.Room_ID == room_id).FirstOrDefault();
                if (_room == null)
                {
                    return HttpNotFound();
                }
                var _seat = _dbContext.Seats.FirstOrDefault(s => s.Show_ID == show_id && s.Room_ID == room_id);
                if (_seat == null)
                {
                    return HttpNotFound();
                }
                var tmp = new TMP
                {
                    Show_ID = show_id,
                    Room_ID = room_id,
                    Name_Room = _room.Room_Name,
                    Day = _show.Day,
                    Booked = _seat.Booked,
                    Start = _show.Start_Movie,
                    Row = _room.Row,
                    Col = _room.Col,
                    FilmName = _show.Film.name,
                    FilmSrc = _show.Film.src,
                    Price_Show = _show.Price
                };
                return View("~/Views/Home/bookingTicket.cshtml", tmp);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error: {ex.Message}");
                return HttpNotFound();
            }
        }
        [HttpPost]
        public JsonResult Booking_Ticked(int id_show,int user_id,int total)
        {
            var _show = _dbContext.Shows.FirstOrDefault(s => s.Show_ID == id_show);
            var booking=new Booking
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
                .Where(s => s.Booking_Date >= start && s.Booking_Date <= end)
                .ToList();

            var mostBookedFilm = _dbContext.Bookings
                .Include("Show")
                .Include("Show.Film")
                .Where(b => b.Booking_Date >= start && b.Booking_Date <= end)
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
                .Where(b => b.Booking_Date >= start && b.Booking_Date <= end)
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
    } 
}