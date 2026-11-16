using Discord;
using Discord.WebSocket;

namespace MessageBot;

internal static class Program
{
    public static async Task<int> Main()
    {
        var token = Environment.GetEnvironmentVariable("DISCORD_BOT_TOKEN");

        if (string.IsNullOrWhiteSpace(token))
        {
            Console.Error.WriteLine(
                "Missing environment variable: 'DISCORD_BOT_TOKEN'");

            return 1;
        }

        using var shutdown = new CancellationTokenSource();

        ConsoleCancelEventHandler cancelHandler = (_, args) =>
        {
            args.Cancel = true;
            shutdown.Cancel();
        };

        Console.CancelKeyPress += cancelHandler;

        using var client = new DiscordSocketClient(
            new DiscordSocketConfig
            {
                GatewayIntents = GatewayIntents.Guilds,
                LogLevel = LogSeverity.Info
            });

        client.Log += OnLogAsync;
        client.Ready += () =>
        {
            Console.WriteLine(
            $"Connected as {client.CurrentUser.Username}!");

            return Task.CompletedTask;
        };

        try
        {
            await client.LoginAsync(TokenType.Bot, token);
            await client.StartAsync();

            await Task.Delay(Timeout.Infinite, shutdown.Token);

            return 0;
        }

        catch (OperationCanceledException)
            when (shutdown.IsCancellationRequested)
        {
            return 0;
        }
        catch (Exception exception)
        {
            // Avoid printing credentials or sensitive request details.
            Console.Error.WriteLine(
                $"Bot stopped unexpectedly: {exception.GetType().Name}.");

            return 1;
        }
        finally
        {
            Console.CancelKeyPress -= cancelHandler;

            try
            {
                await client.StopAsync();
                await client.LogoutAsync();
            }
            catch (Exception exception)
            {
                Console.Error.WriteLine(
                    $"Shutdown failed: {exception.GetType().Name}.");
            }
        }
    }

    private static Task OnLogAsync(LogMessage message)
    {
        Console.WriteLine(
            $"[{DateTimeOffset.Now:yyyy-MM-dd HH:mm:ss zzz}] " +
            $"[{message.Severity}] [{message.Source}] {message.Message}");

        if (message.Exception is not null)
        {
            Console.Error.WriteLine(
                $"Exception: {message.Exception.GetType().Name}");
        }

        return Task.CompletedTask;
    }
}
