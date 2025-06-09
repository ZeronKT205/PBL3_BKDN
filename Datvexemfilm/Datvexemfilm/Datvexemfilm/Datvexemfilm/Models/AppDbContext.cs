namespace Datvexemfilm.Models
{
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
        public DbSet<Show> Shows { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<SeatOrder> seatOrders { get; set; }
        public DbSet<Payment> payments { get; set; }
        public DbSet<Product> products { get; set; }
        public DbSet<Order_Product> order_Products { get; set; }


    }
}