namespace Datvexemfilm.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Product")]
    public class Product
    {
        [Key]
        public int Product_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string img { get; set; }
        public string Status { get; set; }
        public ICollection<Order_Product> Order_Products { get; set; }
    }
}