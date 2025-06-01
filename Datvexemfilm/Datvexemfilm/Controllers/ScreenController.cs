using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class ScreenController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        [HttpGet]

        public JsonResult getallscreen()
        {
           var rooms=_dbContext.Rooms.ToList();
            return Json(rooms, JsonRequestBehavior.AllowGet);
        }
    }
}