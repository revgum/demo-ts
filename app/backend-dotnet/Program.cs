using System.Text.Json;
using backend_dotnet;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
using var dbContext = new TestContext();
var service = new TestService(dbContext);
var options = new JsonSerializerOptions(JsonSerializerDefaults.Web) { WriteIndented = true };

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


