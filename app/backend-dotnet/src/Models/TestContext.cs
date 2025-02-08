using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.src.Models;

public class TestContext(DbContextOptions<TestContext> options) : DbContext(options)
{
    public DbSet<Test> Tests { get; set; }
}
