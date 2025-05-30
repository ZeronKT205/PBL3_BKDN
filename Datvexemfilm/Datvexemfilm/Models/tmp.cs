// Models/BookingViewModel.cs
using System;

namespace Datvexemfilm.Models
{
    public class TMP
    {
        public int Show_ID { get; set; }
        public int Room_ID { get; set; }
        public string Name_Room { get; set; }
        public DateTime Day { get; set; }
        public string Booked { get; set; }
        public TimeSpan Start { get; set; } 
        public int Row { get; set; }
        public int Col { get; set; }
        public string FilmName { get; set; }
        public string FilmSrc { get; set; }
        public int Price_Show { get; set; }
    }
    public class _Payment
    {
        public string Name { get; set; }
        public DateTime Day { get; set; }
        public TimeSpan Start { get; set; }
        public int Price_Show { get; set; }
        public string Seat { get; set; }
        public string Total { get; set; }
        public int Booking_ID { get; set; }
      
        public int Room_ID { get; set; }
        public int Show_ID { get; set; }
        public string Email { get; set; }
        public string Room_Name { get; set; }
    }
}