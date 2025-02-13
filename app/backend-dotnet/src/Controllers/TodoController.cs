using Microsoft.AspNetCore.Mvc;
using backend_dotnet.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.src.Controllers;

[ApiController]
[Route("api/todos")]
public class TodoController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<List<Todo>>> GetTodos() => await _context.Todos.Where(t => t.DeletedAt == null).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Todo>> GetTodo(Guid id)
    {
        Todo? todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }

        return todo;
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoModel model)
    {
        Todo todo = new()
        {
            Title = model.Title,
            Completed = model.Completed,
            DueAt = model.DueAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return todo;
    }

    [HttpPatch("{id:guid}")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Todo>> UpdateTodo(Guid id, [FromBody] UpdateTodoModel model)
    {
        Todo? todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }

        if (model.Title != null) todo.Title = model.Title;
        if (model.Completed != null) todo.Completed = (bool)model.Completed;
        if (model.DueAt != null) todo.DueAt = model.DueAt;
        todo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return todo;
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Todo>> DeleteTodo(Guid id)
    {
        Todo? todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return todo;
    }
}
