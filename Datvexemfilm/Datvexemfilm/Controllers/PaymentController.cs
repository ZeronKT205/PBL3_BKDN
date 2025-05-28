using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
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
        public int getmax()
        {
            var max = _dbContext.Bookings.Max(p => p.Booking_ID);
            return max + 1;
        }
        public string getemail(int user_id)
        {
            var email = _dbContext.Accounts.Where(a => a.User_ID == user_id).Select(a => a.Email).FirstOrDefault();
            return email;
        }
        public ActionResult Payment_Booking(int user_id,int show_id,int room_id,string seat,string total)
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
                Booking_ID = getmax(),
                Email = getemail(user_id),
                Room_Name = _room.Room_Name,
                Room_ID = room_id
                
            };
            return View("~/Views/Home/Payment.cshtml",tmp);
        }
    }
}