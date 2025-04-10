using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Linq;
namespace MySimpleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginControllers : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public LoginControllers(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        { 
            string s=req.Username;
            var q = _dbContext.Accounts.FirstOrDefault(x => x.Username == s);
            if (q==null){
                return BadRequest(new {
                    success = false,
                    message = "Tài khoản không tồn tại"
                });
            }
            else 
            if (q.Password != req.Password)
            {
                return BadRequest(new { 
                    success = false,
                    message = "Mật khẩu không đúng"
                });
            }
            else 
            if( q.Status == "Ban")
            {
                return BadRequest(new {
                    success = false,
                    message = "Tài khoản đã bị khóa"
                });
            }
            else 
            if (q.Password == req.Password){
            return Ok(new {
                success = true,
                message = "Đăng nhập thành công",
                role= q.Role,
            });
            }
            else
            {
                return BadRequest(new {
                    success = false,
                    message = "Đăng nhập thất bại"
            });
        }
        }

}}
