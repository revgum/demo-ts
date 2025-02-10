using backend_dotnet.src.Models;
using Dapr.Client;
using System.Dynamic;
using System.Text.Json;

namespace backend_dotnet.src.Services;

public class Backend
{
  public async Task<List<Test>> GetTests()
  {
    using var client = new DaprClientBuilder().UseTimeout(TimeSpan.FromSeconds(2)).Build();
    dynamic json = await client.InvokeMethodAsync<ExpandoObject>(HttpMethod.Get, "backend", "test-get-all");
    List<Test> tests = JsonSerializer.Deserialize<List<Test>>(json.payload) ?? throw new Exception("Error deserializing json");
    return tests;
  }
}
