// Models/BookingViewModel.cs
using System;

namespace Datvexemfilm.Models
{
    public class TMP
    {
        public int Show_ID { get; set; }
        public string Name { get; set; }
        public DateTime Day { get; set; }
        public string Booked { get; set; }
        public TimeSpan Start { get; set; } 
        public int Row { get; set; }
        public int Col { get; set; }
        public string FilmName { get; set; }
        public string FilmSrc { get; set; }
        public int Price_Show { get; set; }
    }
}