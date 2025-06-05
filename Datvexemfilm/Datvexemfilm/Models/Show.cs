namespace Datvexemfilm.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Show")]
    public class Show
    {
        [Key]
        public int Show_ID { get; set; }
        [ForeignKey("Room")]

        public int Room_ID { get; set; }
        public  Room Room { get; set; }

        [ForeignKey("Film")]
        public int ID_Movie { get; set; }

        public Film Film { get; set; }

        public TimeSpan Start_Movie { get; set; }
        public TimeSpan End_Movie { get; set; }

        public DateTime Day { get; set; }
        public string Status { get; set; }
        public int Price { get; set; }
        public ICollection<Seat> Seats { get; set; }
        public ICollection<Booking> Bookings { get; set; }

    }   
}
