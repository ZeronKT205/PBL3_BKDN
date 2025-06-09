namespace Datvexemfilm.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Payment")]
    public class Payment
    {
        [Key]
        public int Payment_ID { get; set; }
        public int Booking_ID { get; set; }
        [ForeignKey("Booking_ID")]
        public Booking Booking { get; set; }
        public decimal Amount { get; set; }
        public DateTime Created_On { get; set; }
        public string Detail { get; set; }
    }
}