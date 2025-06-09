namespace Datvexemfilm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Seat")]
    public class Seat
    {
        [Key]
        public int Seat_ID { get; set; }
        [ForeignKey("Room")]
        public int Room_ID { get; set; }
        public Room Room { get; set; }

        [ForeignKey("Show")]
        public int Show_ID { get; set; }

        public Show Show { get; set; }

        public string Booked { get; set; }
        public ICollection<SeatOrder> SeatOrders { get; set; }
    }
}
