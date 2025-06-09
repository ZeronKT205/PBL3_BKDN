using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class ShowController : Controller
    {
        private readonly AppDbContext _dbContext;

        public ShowController()
        {
            _dbContext = new AppDbContext();
        }
        [HttpGet]
        public JsonResult getDay(int id)
        {
            var _day = _dbContext.Shows
                .Where(s => s.ID_Movie == id && s.Day >= DateTime.UtcNow)
                .OrderBy(s => s.Day)
                .Select(s => new
                {
                    s.Day
                })
                .Distinct()
                .ToList();
            return Json(_day, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult getShowofDay(int id,DateTime day)
        {
           var _show = _dbContext.Shows
                .Where(s => s.ID_Movie == id && s.Day == day)
                .Include(s=>s.Room)
                .Select(s => new
                {
                    s.Show_ID,
                    s.Room_ID,
                    s.Start_Movie,
                    s.End_Movie,
                    s.Status,
                    Name=s.Room.Room_Name
                })
                .ToList();
            return Json(_show, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult getallshow()
        {
            var show = _dbContext.Shows.Include("Film").Include("Room").ToList();
            List<_Show> shows = new List<_Show>();
            foreach (var item in show)
            {
                var tmp =new _Show
                {
                    ID_Show = item.Show_ID,
                    Name_Movie = item.Film.name,
                    Name_Room = item.Room.Room_Name,
                    Day = item.Day,
                    Start_Movie = item.Start_Movie,
                    End_Movie = item.End_Movie,
                    Price=item.Price
                };
                shows.Add(tmp);
            }
            return Json(shows, JsonRequestBehavior.AllowGet);

        }
        [HttpPost] 
        public JsonResult addshow(Show newshow)
        {
            Show _newshow = newshow;
            _dbContext.Shows.Add(_newshow);
            _dbContext.SaveChanges();
            var seat = new Seat
            {
                Room_ID = _newshow.Room_ID,
                Show_ID = _newshow.Show_ID,
                Booked = "",
            };
            _dbContext.Seats.Add(seat);
            _dbContext.SaveChanges();
            return Json(new {succes=true}, JsonRequestBehavior.AllowGet);
        }
        [HttpPut]
        public JsonResult UpdateShow(int id, Show show)
        {
            try
            {
                var existingShow = _dbContext.Shows.Find(id);
                if (existingShow == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy suất chiếu!" }, JsonRequestBehavior.AllowGet);
                }

                // Update show properties
                existingShow.Price = show.Price;
                existingShow.Start_Movie = show.Start_Movie;
                existingShow.ID_Movie = show.ID_Movie;
                existingShow.End_Movie = show.End_Movie;
                existingShow.Day = show.Day;
                existingShow.Room_ID = show.Room_ID;
                existingShow.Status = show.Status;

                // Update related seat if room changed
                var seat = _dbContext.Seats.FirstOrDefault(s => s.Show_ID == id);
                if (seat != null)
                {
                    seat.Room_ID = show.Room_ID;
                }

                _dbContext.SaveChanges();
                return Json(new { success = true, message = "Cập nhật suất chiếu thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpDelete]
        public JsonResult DeleteShow(int show_id)
        {
            try
            {
                var show = _dbContext.Shows.Find(show_id);
               show.Status = "inactive";
                _dbContext.SaveChanges();

                return Json(new { success = true, message = "Xóa suất chiếu thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}