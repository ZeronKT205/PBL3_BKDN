using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Datvexemfilm.Models;
namespace Datvexemfilm.Controllers
{
    public class FilmController : Controller
    {
        private readonly AppDbContext _dbContext = new AppDbContext();

        [HttpGet]
        public JsonResult GetFilm()
        {
            try
            {
                var films = _dbContext.Films.Where(p => p.Status != "OFF").ToList();
                return Json(films, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetFilm_On()
        {
            var films = _dbContext.Films
                .Where(p => p.Status == "ON")
                .Include(f => f.Film_Type)
                .Select(f => new
                {
                    f.ID,
                    f.src,
                    f.name,
                    Type = f.Film_Type.Name,
                    f.releaseDay,
                    f.Director,
                    f.Language,
                    f.Duration,
                    f.ShortDescription,
                    f.FullDescription,
                    f._Cast
                })
                .ToList();

            return Json(films, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetFilm_Next()
        {
            var films = _dbContext.Films
            .Where(p => p.Status == "NEXT")
            .Include(f => f.Film_Type)
            .Select(f => new
            {
                f.ID,
                f.src,
                f.name,
                Type = f.Film_Type.Name,
                f.releaseDay,
                f.Director,
                f.Language,
                f.Duration,
                f.ShortDescription,
                f.FullDescription,
                f._Cast
            })
            .ToList();
            return Json(films, JsonRequestBehavior.AllowGet);
        }
        public ActionResult detailmovie(int id)
        {
            var film = _dbContext.Films
                .Include(f => f.Film_Type)
                .FirstOrDefault(f => f.ID == id);
            if (film == null)
            {
                return HttpNotFound();
            }
            return View("~/Views/Home/detailmovie.cshtml", film);
        }
    }
}
