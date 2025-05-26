namespace Datvexemfilm.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Film")]
    public class Film
    {
        [Key]
        public int ID { get; set; }

        public string src { get; set; }
        public string name { get; set; }
        public string releaseDay { get; set; }

        [ForeignKey("Film_Type")]
        public int ID_Type { get; set; }

        public Film_Type Film_Type { get; set; }

        public string Status { get; set; }
        public decimal Duration { get; set; }
        public string Language { get; set; }
        public string Director { get; set; }
        public string FullDescription { get; set; }
        public string Poster { get; set; }
        public string ShortDescription { get; set; }
        public string _Cast { get; set; }
        public string Trailer { get; set; }
    }
}
