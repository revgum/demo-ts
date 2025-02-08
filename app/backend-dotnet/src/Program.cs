using backend_dotnet.src.Common;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var connectionString = builder.Configuration.GetConnectionString("Postgres") ?? throw new Exception("Postgres connection string missing.");
using var dbContext = new TestContext(connectionString);
var service = new TestService(dbContext);

app.MapPost("/test", (Test test) =>
{
    Console.WriteLine("POST: test received : " + test);
    return test.ToString();
});

app.MapGet("/test", () =>
{
    Console.WriteLine("GET: test received");
    return "test";
});

app.MapGet("/test-get-all", async () =>
{
    Console.WriteLine("GET: test-get-all received");
    var records = await service.GetAll();
    return Results.Json(new { payload = records });
});

app.Run();


