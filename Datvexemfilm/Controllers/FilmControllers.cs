using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Linq;
using System.Numerics;
namespace MySimpleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmControllers : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public FilmControllers(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("getfilm")]
        public IEnumerable<Film> film()
        { 
           return _dbContext.Films.ToList();
        }

}}
