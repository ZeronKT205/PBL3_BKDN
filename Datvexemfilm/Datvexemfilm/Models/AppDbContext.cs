using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity; // EF6 trong MVC Framework

public class AppDbContext : DbContext
{
    public AppDbContext() : base("AppDbContext")
    {
    }

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Film> Films { get; set; }
}

[Table("Account")]
public class Account
{
    [Key]
    public string Username { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }
    public string Status { get; set; }
}

[Table("Film")]
public class Film
{
    [Key]
    public string src { get; set; }
    public string name { get; set; }
    public string releaseDay { get; set; }
}
