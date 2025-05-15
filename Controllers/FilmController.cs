using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
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
                .Select(f => new _Film
                {
                    ID = f.ID,
                    src = f.src,
                    name = f.name,
                    Type = f.Film_Type.Name,
                    releaseDay = f.releaseDay,
                    Director = f.Director,
                    Language = f.Language,
                    Duration = f.Duration
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
            .Select(f => new _Film
            {
                ID = f.ID,
                src = f.src,
                name = f.name,
                Type = f.Film_Type.Name,
                releaseDay = f.releaseDay,
                Director = f.Director,
                Language = f.Language,
                Duration = f.Duration
            })
            .ToList();
            return Json(films, JsonRequestBehavior.AllowGet);
        }
    }
}
