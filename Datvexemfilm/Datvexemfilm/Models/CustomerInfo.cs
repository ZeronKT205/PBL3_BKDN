using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
[Table("CustomerInfo")]
public class CustomerInfo
    {
    [Key]
    public int ID { get; set; }
    public string fullname { get; set; }
    public DateTime Birthday { get; set; }
    public string Gender { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
}
