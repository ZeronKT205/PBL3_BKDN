namespace Datvexemfilm.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("SeatOrder")]
    public class SeatOrder
    {
        [Key]
        public int SeatOrder_ID { get; set; }
        public int Seat_ID { get; set; }
        [ForeignKey("Seat_ID")]
        public Seat Seat { get; set; }
        public string Choice { get; set; }

    }
}