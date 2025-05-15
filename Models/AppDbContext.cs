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
    public DbSet<Film_Type> Film_Types { get; set; }
    public DbSet<CustomerInfo> customerInfos { get; set; }
}