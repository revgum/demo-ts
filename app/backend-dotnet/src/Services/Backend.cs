using Dapr.Client;
using System.Dynamic;
using System.Text.Json;

namespace backend_dotnet.src.Services;

public class Backend
{
  public async Task<List<ExpandoObject>> GetTests()
  {
    using var client = new DaprClientBuilder().UseTimeout(TimeSpan.FromSeconds(2)).Build();
    dynamic json = await client.InvokeMethodAsync<ExpandoObject>(HttpMethod.Get, "backend-ts", "test-get-all");
    List<ExpandoObject> tests = JsonSerializer.Deserialize<List<ExpandoObject>>(json.payload) ?? throw new Exception("Error deserializing json");
    return tests;
  }
}
