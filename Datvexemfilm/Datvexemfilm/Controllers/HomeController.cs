using Datvexemfilm.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Datvexemfilm.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();
        public ActionResult detailmovie(int id)
        {
            var film = _dbContext.Films
                .Include(f => f.Film_Type)
                .FirstOrDefault(f => f.ID_Movie == id);
            if (film == null)
            {
                return HttpNotFound();
            }
            return View(film);
        }
        public ActionResult home()
        {
            return View();
        }
        public ActionResult index()
        {
            return View();
        }
    }
}