using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
public class AppDbContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Film> Films { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
[Table("Account")]
public class Account
{
    [Key]
    public string Username { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
[Table("Film")]
public class Film
{
    [Key]
    public string src { get; set; }
    public string name { get; set; }
    public string releaseDay { get; set; }
}