using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend_dotnet.src.Models;

[Table("todo")]
public class Todo
{
  [Key]
  [Column("id")]
  [JsonPropertyName("id")]
  public Guid Id { get; internal set; }

  [Column("title")]
  [JsonPropertyName("title")]
  public required string Title { get; set; }

  [Column("completed")]
  [JsonPropertyName("completed")]
  public required bool Completed { get; set; }

  [Column("due_at")]
  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; set; }

  [Column("created_at")]
  [JsonPropertyName("created_at")]
  public required DateTime CreatedAt { get; set; }

  [Column("updated_at")]
  [JsonPropertyName("updated_at")]
  public DateTime? UpdatedAt { get; set; }

  [Column("deleted_at")]
  [JsonPropertyName("deleted_at")]
  public DateTime? DeletedAt { get; set; }

}

public class CreateTodoModel
{
  [JsonPropertyName("title")]
  public required string Title { get; set; }
  [JsonPropertyName("completed")]
  public bool Completed { get; set; } = false;
  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; set; }
}

public class UpdateTodoModel
{
  [JsonPropertyName("title")]
  public string? Title { get; set; }
  [JsonPropertyName("completed")]
  public bool? Completed { get; set; } = false;
  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; set; }
}
