namespace Datvexemfilm.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Room")]
    public class Room
    {
        [Key]
        public int Room_ID { get; set; }
        public string Room_Name { get; set; }
        public int capacity { get; set; }
        public string Status { get; set; }
        public int Row { get; set; }
        public int Col { get; set; }
        public ICollection<Seat> Seats { get; set; }
        [JsonIgnore]
        public ICollection<Show> Shows { get; set; }
    }
}
