using Microsoft.AspNetCore.Mvc;
using backend_dotnet.src.Models;
using backend_dotnet.src.Services;

namespace backend_dotnet.src.Controllers;

[ApiController]
[Route("api/tests")]
public class TestController(TestContext context) : ControllerBase
{
    private readonly TestContext _context = context;

    [HttpGet]
    public async Task<ActionResult<List<Test>>> GetTests()
    {
        return await new Backend().GetTests();
    }
}
