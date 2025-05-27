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
                .Where(s => s.ID_Movie == id)
                .OrderBy(s=>s.Day)
                .Select(s => new
                {
                    s.Day
                })
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
    }
}