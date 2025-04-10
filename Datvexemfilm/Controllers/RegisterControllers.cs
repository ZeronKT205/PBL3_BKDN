using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Linq;
namespace MySimpleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
public class RegisterControllers : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public RegisterControllers(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("register")]
    public IActionResult Dangki([FromBody] RegisterRequest req)
    { 
        var q = _dbContext.Accounts.FirstOrDefault(x => x.Username == req.Username);
        var p = _dbContext.Accounts.FirstOrDefault(x => x.Email == req.Email);
        if (q != null)
        {
            return BadRequest(new {
                success = false,
                message = "Tài khoản đã tồn tại"
            });
        }
        else 
        if (p!=null)
        {
            return BadRequest(new {
                success = false,
                message = "Email đã tồn tại"
            });
        }
        else
        {
            var newAccount = new Account { Username = req.Username, Password = req.Password ,Email = req.Email, Role = "user", Status = "Normal" };
            _dbContext.Accounts.Add(newAccount);
            _dbContext.SaveChanges();
            return Ok(new {
                success = true,
                message = "Đăng ký thành công"
            });
        }
    }
}

}