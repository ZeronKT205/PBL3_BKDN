// Models/BookingViewModel.cs
using System;
using System.Collections.Generic;

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
    public class TicketViewModel
    {
        public string Name_User { get; set; }
        public string Id { get; set; }
        public string Title { get; set; }
        public string Status { get; set; }
        public string BookingDate { get; set; }
        public string Showtime { get; set; }
        public List<ComboItem> Combo { get; set; }
        public string Price { get; set; }
        public string Poster { get; set; }
        public string CinemaRoom { get; set; }
        public string Seat { get; set; }

        public class ComboItem
        {
            public string Name { get; set; }
            public int Quantity { get; set; }
            public string Price { get; set; }
        }
    }
    public class _Show
    {
        public int ID_Show { get; set; }
        public string Name_Movie { get;set; }
        public string Name_Room { get; set; }
        public DateTime Day { get; set; }
        public TimeSpan Start_Movie { get; set; }
        public TimeSpan End_Movie { get; set; }
        public int Price { get; set; }
    }

}