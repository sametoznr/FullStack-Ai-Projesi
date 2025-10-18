using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ChatDbContext _context;

    public UsersController(ChatDbContext context)
    {
        _context = context;
    }

    // POST: api/users/register
    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nickname))
        {
            return BadRequest(new { error = "Nickname gereklidir" });
        }

        // Aynı nickname var mı kontrol et
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Nickname == request.Nickname);

        if (existingUser != null)
        {
            return Conflict(new { error = "Bu nickname zaten kullanılıyor" });
        }

        var user = new User
        {
            Nickname = request.Nickname,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserResponse
        {
            Id = user.Id,
            Nickname = user.Nickname,
            CreatedAt = user.CreatedAt
        });
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Nickname = u.Nickname,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new { error = "Kullanıcı bulunamadı" });
        }

        return Ok(new UserResponse
        {
            Id = user.Id,
            Nickname = user.Nickname,
            CreatedAt = user.CreatedAt
        });
    }
}

// Request/Response DTOs
public class RegisterRequest
{
    public string Nickname { get; set; } = string.Empty;
}

public class UserResponse
{
    public int Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}