using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Linq;
namespace MySimpleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
public class UserControllers : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserControllers(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("getuser")]
    public IEnumerable<Account> getalluser()
    { 
        return _dbContext.Accounts.ToList();
    }
}

}