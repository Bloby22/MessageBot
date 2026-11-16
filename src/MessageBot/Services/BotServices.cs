using Discord;
using Discord.WebSocket;

namespace MessageBot.Services;

/// <summary>
/// Manages the Discord connection for the lifetime of the application.
/// The caller owns and disposes the Discord client.
/// </summary>
public sealed class BotService(DiscordSocketClient client)
{
    private readonly DiscordSocketClient _client =
        client ?? throw new ArgumentNullException(nameof(client));

    private int _running;

    public async Task RunAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        cancellationToken.ThrowIfCancellationRequested();

        if (Interlocked.CompareExchange(ref _running, 1, 0) != 0)
        {
            throw new InvalidOperationException(
                "The bot service is already running.");
        }

        var loggedIn = false;
        var startAttempted = false;

        try
        {
            await _client.LoginAsync(TokenType.Bot, token);
            loggedIn = true;

            cancellationToken.ThrowIfCancellationRequested();

            startAttempted = true;
            await _client.StartAsync();

            await Task.Delay(Timeout.Infinite, cancellationToken);
        }
        catch (OperationCanceledException)
            when (cancellationToken.IsCancellationRequested)
        {
            // Cancellation is the normal shutdown path.
        }
        finally
        {
            try
            {
                if (startAttempted)
                {
                    await StopAsync();
                }

                if (loggedIn)
                {
                    await LogoutAsync();
                }
            }
            finally
            {
                Volatile.Write(ref _running, 0);
            }
        }
    }

    private async Task StopAsync()
    {
        try
        {
            await _client.StopAsync();
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Failed to stop the Discord client: " +
                $"{exception.GetType().Name}.");
        }
    }

    private async Task LogoutAsync()
    {
        try
        {
            await _client.LogoutAsync();
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Failed to log out of Discord: " +
                $"{exception.GetType().Name}.");
        }
    }
}
