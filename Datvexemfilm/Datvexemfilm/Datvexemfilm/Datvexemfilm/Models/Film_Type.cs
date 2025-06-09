namespace Datvexemfilm.Models
{
    using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Film_Type")]
public class Film_Type
{
    [Key]
    public int ID_Type { get; set; }
    public string Name { get; set; }

    public ICollection<Film> Films { get; set; }
}
}