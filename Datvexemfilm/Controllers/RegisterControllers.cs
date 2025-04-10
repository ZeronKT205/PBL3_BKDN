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
    public IActionResult Dangki([FromBody] LoginRequest req)
    { 
        string s = req.Username;
        var q = _dbContext.Accounts.FirstOrDefault(x => x.Username == s);
        if (q != null)
        {
            return BadRequest(new {
                success = false,
                message = "Tài khoản đã tồn tại"
            });
        }
        else
        {
            string p = req.Password;
            var newAccount = new Account { Username = s, Password = p };
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