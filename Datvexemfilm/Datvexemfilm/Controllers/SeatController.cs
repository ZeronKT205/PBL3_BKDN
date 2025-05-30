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
            var _seatid = _dbContext.Seats.Where(s => s.Room_ID == Room_ID && s.Show_ID == Room_ID).Select(s => s.Seat_ID);
            var _seatorder = new SeatOrder
            {
                Seat_ID = _seatid.FirstOrDefault(),
                Choice = Choice
            };
            _dbContext.seatOrders.Add(_seatorder);
            _dbContext.SaveChanges();
            return Json(new { id=_seatorder.SeatOrder_ID,success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}