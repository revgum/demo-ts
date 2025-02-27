using Microsoft.AspNetCore.Mvc;
using backend_dotnet.src.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace backend_dotnet.src.Controllers;

[ApiController]
[Route("api/todos")]
public class TodoController(AppDbContext context) : ControllerBase
{
    private readonly Metrics _metrics = new();
    private readonly AppDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<List<Todo>>> GetTodos()
    {
        var success = false;
        KeyValuePair<string, object?>[] tags = [];
        try
        {
            List<Todo> todos;
            using (Activity? activity = Traces.source.StartActivity("db.get-all-todo"))
            {
                todos = await _context.Todos.Where(t => t.DeletedAt == null).ToListAsync();
            }
            success = true;
            return todos;
        }
        finally
        {
            tags = [new KeyValuePair<string, object?>("success", success)];
            _metrics.Increment("todo.getall", tags);
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Todo>> GetTodo(Guid id)
    {
        var success = false;
        KeyValuePair<string, object?>[] tags = [];
        try
        {
            Todo? todo;
            using (Activity? activity = Traces.source.StartActivity("db.get-one-todo"))
            {
                todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
            }
            if (todo == null)
            {
                return NotFound();
            }

            success = true;
            return todo;

        }
        finally
        {
            tags = [new KeyValuePair<string, object?>("success", success)];
            _metrics.Increment("todo.get", tags);
        }
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoModel model)
    {
        var success = false;
        KeyValuePair<string, object?>[] tags = [];
        try
        {
            Todo todo = new()
            {
                Title = model.Title,
                Completed = model.Completed,
                CreatedAt = DateTime.UtcNow
            };

            if (DateTime.TryParse(model.DueAt.ToString(), out DateTime DueAt))
            {
                todo.DueAt = DueAt.ToUniversalTime();
            }

            using (Activity? activity = Traces.source.StartActivity("db.create-todo"))
            {
                _context.Todos.Add(todo);
                await _context.SaveChangesAsync();
            }
            success = true;
            return todo;
        }
        finally
        {
            tags = [new KeyValuePair<string, object?>("success", success)];
            _metrics.Increment("todo.create", tags);
        }
    }

    [HttpPatch("{id:guid}")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Todo>> UpdateTodo(Guid id, [FromBody] UpdateTodoModel model)
    {
        var success = false;
        KeyValuePair<string, object?>[] tags = [];
        try
        {
            Todo? todo;
            using (Activity? activity = Traces.source.StartActivity("db.get-one-todo"))
            {
                todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
            }
            if (todo == null)
            {
                return NotFound();
            }

            if (model.Title != null) todo.Title = model.Title;
            if (model.Completed != null) todo.Completed = (bool)model.Completed;
            if (DateTime.TryParse(model.DueAt.ToString(), out DateTime DueAt))
            {
                todo.DueAt = DueAt.ToUniversalTime();
            }
            todo.UpdatedAt = DateTime.UtcNow;

            using (Activity? activity = Traces.source.StartActivity("db.update-todo"))
            {
                await _context.SaveChangesAsync();
            }
            success = true;
            return todo;
        }
        finally
        {
            tags = [new KeyValuePair<string, object?>("success", success)];
            _metrics.Increment("todo.update", tags);
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Todo>> DeleteTodo(Guid id)
    {
        var success = false;
        KeyValuePair<string, object?>[] tags = [];
        try
        {
            Todo? todo;
            using (Activity? activity = Traces.source.StartActivity("db.get-one-todo"))
            {
                todo = await _context.Todos.SingleOrDefaultAsync(t => t.DeletedAt == null && t.Id == id);
            }
            if (todo == null)
            {
                return NotFound();
            }
            todo.DeletedAt = DateTime.UtcNow;

            using (Activity? activity = Traces.source.StartActivity("db.delete-todo"))
            {
                await _context.SaveChangesAsync();
            }
            success = true;
            return todo;
        }
        finally
        {
            tags = [new KeyValuePair<string, object?>("success", success)];
            _metrics.Increment("todo.delete", tags);
        }
    }
}
