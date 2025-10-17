using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ChatDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public MessagesController(
        ChatDbContext context,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    // POST: api/messages
    [HttpPost]
    public async Task<ActionResult<MessageResponse>> SendMessage([FromBody] SendMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
        {
            return BadRequest(new { error = "Mesaj içeriği boş olamaz" });
        }

        // Kullanıcı var mı kontrol et
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
        {
            return NotFound(new { error = "Kullanıcı bulunamadı" });
        }

        // AI servisinden duygu analizi al
        var sentimentResult = await GetSentimentAnalysis(request.Content);

        // Mesajı veritabanına kaydet
        var message = new Message
        {
            UserId = request.UserId,
            Content = request.Content,
            Sentiment = sentimentResult.Sentiment,
            SentimentScore = sentimentResult.Score,
            CreatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Mesajı user bilgisiyle birlikte döndür
        return Ok(new MessageResponse
        {
            Id = message.Id,
            UserId = message.UserId,
            UserNickname = user.Nickname,
            Content = message.Content,
            Sentiment = message.Sentiment,
            SentimentScore = message.SentimentScore,
            CreatedAt = message.CreatedAt
        });
    }

    // GET: api/messages
    [HttpGet]
    public async Task<ActionResult<List<MessageResponse>>> GetMessages([FromQuery] int limit = 50)
    {
        var messages = await _context.Messages
            .Include(m => m.User)
            .OrderByDescending(m => m.CreatedAt)
            .Take(limit)
            .Select(m => new MessageResponse
            {
                Id = m.Id,
                UserId = m.UserId,
                UserNickname = m.User!.Nickname,
                Content = m.Content,
                Sentiment = m.Sentiment,
                SentimentScore = m.SentimentScore,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        messages.Reverse(); // En eski mesaj üstte olsun
        return Ok(messages);
    }

    // Hugging Face Gradio API'sine istek gönder (Async pattern)
    private async Task<SentimentResult> GetSentimentAnalysis(string text)
    {
        try
        {
            var baseUrl = _configuration["AiServiceUrl"] ??
                "https://samet214-chat-sentiment-ai.hf.space";

            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(30);

            // 1. Adım: Event ID al
            var requestBody = new
            {
                data = new[] { text }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var callUrl = $"{baseUrl}/gradio_api/call/predict";
            var callResponse = await httpClient.PostAsync(callUrl, content);

            if (!callResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"Call başarısız: {callResponse.StatusCode}");
                return new SentimentResult { Sentiment = "neutral", Score = 0.0 };
            }

            var callContent = await callResponse.Content.ReadAsStringAsync();
            var eventResult = JsonSerializer.Deserialize<GradioEventResponse>(callContent);

            if (string.IsNullOrEmpty(eventResult?.EventId))
            {
                return new SentimentResult { Sentiment = "neutral", Score = 0.0 };
            }

            // 2. Adım: Sonucu al (stream olarak gelir)
            var resultUrl = $"{baseUrl}/gradio_api/call/predict/{eventResult.EventId}";
            var resultResponse = await httpClient.GetAsync(resultUrl);

            if (resultResponse.IsSuccessStatusCode)
            {
                var resultContent = await resultResponse.Content.ReadAsStringAsync();

                // Stream içinden JSON'ı parse et
                var lines = resultContent.Split('\n');
                foreach (var line in lines)
                {
                    if (line.StartsWith("data:"))
                    {
                        var jsonPart = line.Substring(5).Trim();

                        // Boş satırları atla
                        if (string.IsNullOrWhiteSpace(jsonPart))
                            continue;

                        try
                        {
                            // Direkt array olarak parse et: [{"sentiment": "...", "score": ...}]
                            var dataArray = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(jsonPart);

                            if (dataArray != null && dataArray.Count > 0)
                            {
                                var firstItem = dataArray[0];
                                if (firstItem.ContainsKey("sentiment") && firstItem.ContainsKey("score"))
                                {
                                    var sentiment = firstItem["sentiment"].GetString() ?? "neutral";
                                    var score = firstItem["score"].GetDouble();

                                    return new SentimentResult
                                    {
                                        Sentiment = sentiment,
                                        Score = score
                                    };
                                }
                            }
                        }
                        catch (Exception parseEx)
                        {
                            Console.WriteLine($"Parse hatası: {parseEx.Message}");
                            continue;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AI servisi hatası: {ex.Message}");
        }

        return new SentimentResult { Sentiment = "neutral", Score = 0.0 };
    }
}

// Request/Response DTOs
public class SendMessageRequest
{
    public int UserId { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class MessageResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserNickname { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public double SentimentScore { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SentimentResult
{
    public string Sentiment { get; set; } = "neutral";
    public double Score { get; set; }
}

public class GradioEventResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("event_id")]
    public string? EventId { get; set; }
}

public class GradioDataResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("data")]
    public List<SentimentData>? Data { get; set; }
}

public class SentimentData
{
    [System.Text.Json.Serialization.JsonPropertyName("sentiment")]
    public string? Sentiment { get; set; }

    [System.Text.Json.Serialization.JsonPropertyName("score")]
    public double Score { get; set; }
}