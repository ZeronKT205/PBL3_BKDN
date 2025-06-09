
// LoginRequest.cs - hoặc có thể để trong cùng file nhưng ngoài class controller
namespace Datvexemfilm.Controllers
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}