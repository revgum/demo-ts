using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.src.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos { get; set; }

    #region DefaultValues
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Todo>().Property(b => b.CreatedAt).HasDefaultValueSql("now()");
        modelBuilder.Entity<Todo>().Property(b => b.Completed).HasDefaultValue(false);
    }
    #endregion
}
