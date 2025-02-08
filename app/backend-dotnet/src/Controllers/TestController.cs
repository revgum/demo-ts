using Microsoft.AspNetCore.Mvc;
using backend_dotnet.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.src.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController(TestContext context) : ControllerBase
{
    private readonly TestContext _context = context;

    [HttpGet]
    public async Task<ActionResult<List<Test>>> GetTests()
    {
        return await _context.Tests.ToListAsync();
    }
}
