namespace Datvexemfilm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Booking")]
    public class Booking
    {
        [Key]
        public int Booking_ID { get; set; }
        public int User_ID { get; set; }
        [ForeignKey("User_ID")]
        public CustomerInfo CustomerInfo { get; set; }
        public int Show_ID { get; set; }
        [ForeignKey("Show_ID")]
        public Show Show { get; set; }
        public int SeatOrder_ID { get; set; }
        [ForeignKey("SeatOrder_ID")]
        public SeatOrder SeatOrder { get; set; }
        public int total { get; set; }
        public DateTime Booking_Date { get; set; }
        public string Status { get; set; }
        public ICollection<Order_Product> Order_Products { get; set; }
    }
}