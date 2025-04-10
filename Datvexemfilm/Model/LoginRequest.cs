
// LoginRequest.cs - hoặc có thể để trong cùng file nhưng ngoài class controller
namespace MySimpleApi.Controllers;
public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}
