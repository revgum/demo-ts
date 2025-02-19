using backend_dotnet.src.Models;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace backend_dotnet.src;

public interface IStartup
{
  Task StartAsync(string[] args);
}

public class StartupFactory
{
  public IStartup GetStartup(IEnumerable<string> args)
  {
    return args.Contains("--migrate") ? new MigrationStartup() : new WebApiStartup();
  }
}

public class WebApiStartup : IStartup
{
  public async Task StartAsync(string[] args)
  {

    var builder = WebApplication.CreateBuilder(args);

    builder.Configuration.AddEnvironmentVariables();
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddDbContextPool<AppDbContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres") ?? throw new Exception("Postgres connection string missing.")));

    var otlpEndpoint = builder.Configuration.GetValue<string>("OpenTelemetry:Endpoint");

    Console.WriteLine(otlpEndpoint);

    builder.Services.AddOpenTelemetry()
      .ConfigureResource(resource => resource.AddService(builder.Environment.ApplicationName))
      .WithMetrics(metrics => metrics.AddAspNetCoreInstrumentation().AddOtlpExporter(o =>
      {
        o.Endpoint = new Uri($"{otlpEndpoint}/v1/metrics");
        o.Protocol = OtlpExportProtocol.HttpProtobuf;
      }))
      .WithTracing(tracing => tracing.AddAspNetCoreInstrumentation().AddOtlpExporter(o =>
      {
        o.Endpoint = new Uri($"{otlpEndpoint}/v1/traces");
        o.Protocol = OtlpExportProtocol.HttpProtobuf;
      }));

    var app = builder.Build();

    // app.UseHttpsRedirection();
    // app.UseAuthorization();

    app.MapControllers();

    await app.RunAsync();
  }
}

public class MigrationStartup : IStartup
{
  public async Task StartAsync(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddDbContextPool<AppDbContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres") ?? throw new Exception("Postgres connection string missing.")));
    var app = builder.Build();
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
  }
}
