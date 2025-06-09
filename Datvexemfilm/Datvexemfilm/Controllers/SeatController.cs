using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class SeatController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        [HttpPost]

        public JsonResult Seat_Booking(int Room_ID, int Show_ID, string Choice)
        {
            var _seatid = _dbContext.Seats.Where(s => s.Room_ID == Room_ID && s.Show_ID == Show_ID).Select(s => s.Seat_ID);
            var _seatorder = new SeatOrder
            {
                Seat_ID = _seatid.FirstOrDefault(),
                Choice = Choice
            };
            _dbContext.seatOrders.Add(_seatorder);
            _dbContext.SaveChanges();
            return Json(new { id=_seatorder.SeatOrder_ID,success = true }, JsonRequestBehavior.AllowGet);
        }
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
                return View("~/Views/Booking/bookingTicket.cshtml", tmp);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error: {ex.Message}");
                return HttpNotFound();
            }
        }
    }
}