using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet
{
    public class TestContext : DbContext
    {
        public DbSet<Test> Tests { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(connectionString:
               "Server=postgres;Port=5432;User Id=postgres;Password=postgres;Database=postgres;");
            base.OnConfiguring(optionsBuilder);
        }
    }

    [Table("test")]
    public class Test
    {
        [System.ComponentModel.DataAnnotations.Key]
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
    public class TestService(TestContext context)
    {
        private readonly TestContext _context = context;

        public async Task<Test?> GetById(int id)
        {
            var test = await _context.Tests.FindAsync(id);
            if (test == null)
            {
                return null;
            }
            return test;
        }

        public async Task<List<Test>> GetAll()
        {
            return await _context.Tests.ToListAsync();
        }

    }

}
