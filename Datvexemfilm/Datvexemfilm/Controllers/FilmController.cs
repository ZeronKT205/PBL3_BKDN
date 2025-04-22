using System.Collections.Generic;
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
            var films = _dbContext.Films.ToList();
            return Json(films, JsonRequestBehavior.AllowGet);
        }
    }
}
