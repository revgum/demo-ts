using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend_dotnet.src.Models;

[Table("test")]
public class Test
{
  [Key]
  [Column("id")]
  [JsonPropertyName("id")]
  public int Id { get; internal set; }

  [Column("field1")]
  [JsonPropertyName("field1")]
  public required string Field1 { get; set; }

  [Column("created_at")]
  [JsonPropertyName("created_at")]
  public required DateTime CreatedAt { get; set; }

  [Column("updated_at")]
  [JsonPropertyName("updated_at")]
  public DateTime? UpdatedAt { get; internal set; }

}
