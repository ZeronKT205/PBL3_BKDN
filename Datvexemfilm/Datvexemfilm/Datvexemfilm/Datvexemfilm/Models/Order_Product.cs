namespace Datvexemfilm.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Order_Product")]
    public class Order_Product
    {
        [Key, Column(Order = 0)]
        public int Booking_ID { get; set; }
        [ForeignKey("Booking_ID")]
        public Booking Booking { get; set; }

        [Key, Column(Order = 1)]
        public int Product_ID { get; set; }
        [ForeignKey("Product_ID")]
        public Product Product { get; set; }

        public int quantity { get; set; }
        public int total { get; set; }
    }

}