using Microsoft.EntityFrameworkCore;
using backend_dotnet.src.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers();
builder.Services.AddDbContext<TestContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres") ?? throw new Exception("Postgres connection string missing.")));
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// app.UseHttpsRedirection();
// app.UseAuthorization();

app.MapControllers();

app.Run();
