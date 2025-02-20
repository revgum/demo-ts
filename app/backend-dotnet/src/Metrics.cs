using System.Diagnostics.Metrics;

namespace backend_dotnet.src;

public class Metrics
{
  private readonly Meter meter = new("SOS.BackendDotnet", "1.0");

  private readonly Dictionary<string, Counter<int>> counters = [];

  public void Increment(string counterName, KeyValuePair<string, object?>[]? tags = null)
  {
    if (!counters.TryGetValue(counterName, out Counter<int>? counter) || counter == null)
    {
      counter = meter.CreateCounter<int>(counterName, description: $"Number of {counterName}");
      counters.Add(counterName, counter);
    }

    if (tags?.Length > 0)
    {
      counter.Add(1, tags);
    }
    else
    {
      counter.Add(1);
    }
  }
}
