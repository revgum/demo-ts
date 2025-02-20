using Azure.Monitor.OpenTelemetry.AspNetCore;
using backend_dotnet.src.Models;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
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

    builder.Logging.AddOpenTelemetry(logging =>
    {
      logging.IncludeFormattedMessage = true;
      logging.IncludeScopes = true;
      logging.AddOtlpExporter(o =>
      {
        o.Endpoint = new Uri($"{otlpEndpoint}/v1/logs");
        o.Protocol = OtlpExportProtocol.HttpProtobuf;
      });
    });

    var otel = builder.Services.AddOpenTelemetry();

    otel.ConfigureResource(resource => resource.AddService(builder.Environment.ApplicationName));
    otel.WithMetrics(metrics =>
    {
      metrics.AddAspNetCoreInstrumentation();
      metrics.AddMeter("SOS.*");
      metrics.AddOtlpExporter(o =>
      {
        o.Endpoint = new Uri($"{otlpEndpoint}/v1/metrics");
        o.Protocol = OtlpExportProtocol.HttpProtobuf;
      });
    });

    otel.WithTracing(tracing =>
    {
      tracing.AddAspNetCoreInstrumentation();
      tracing.AddOtlpExporter(o =>
      {
        o.Endpoint = new Uri($"{otlpEndpoint}/v1/traces");
        o.Protocol = OtlpExportProtocol.HttpProtobuf;
      });
    });

    if (!string.IsNullOrEmpty(builder.Configuration.GetValue<string>("AzureMonitor:ConnectionString")))
    {
      otel.UseAzureMonitor();
    }

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
