using System.Reflection;
using Discord;
using Discord.Interactions;
using Discord.WebSocket;

namespace MessageBot.Services;

public sealed class InteractionHandler : IDisposable
{
    private readonly DiscordSocketClient _client;
    private readonly InteractionService _interactions;
    private readonly IServiceProvider _services;
    private readonly ulong? _developmentGuildId;

    private bool _initialized;
    private bool _disposed;

    public InteractionHandler(
        DiscordSocketClient client,
        InteractionService interactions,
        IServiceProvider services,
        ulong? developmentGuildId = null)
    {
        ArgumentNullException.ThrowIfNull(client);
        ArgumentNullException.ThrowIfNull(interactions);
        ArgumentNullException.ThrowIfNull(services);

        _client = client;
        _interactions = interactions;
        _services = services;
        _developmentGuildId = developmentGuildId;
    }

    public async Task InitializeAsync()
    {
        ObjectDisposedException.ThrowIf(_disposed, this);

        if (_initialized)
        {
            throw new InvalidOperationException(
                "The interaction handler is already initialized.");
        }

        await _interactions.AddModulesAsync(
            Assembly.GetExecutingAssembly(),
            _services);

        _client.Ready += OnReadyAsync;
        _client.InteractionCreated += OnInteractionCreatedAsync;

        _initialized = true;
    }

    private async Task OnReadyAsync()
    {
        try
        {
            if (_developmentGuildId is { } guildId)
            {
                await _interactions.RegisterCommandsToGuildAsync(
                    guildId,
                    deleteMissing: false);
            }
            else
            {
                await _interactions.RegisterCommandsGloballyAsync(
                    deleteMissing: false);
            }

            Console.WriteLine("Application commands registered.");
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Command registration failed: {exception.GetType().Name}.");
        }
    }

    private async Task OnInteractionCreatedAsync(
        SocketInteraction interaction)
    {
        if (interaction is not SocketSlashCommand
            and not SocketModal)
        {
            return;
        }

        try
        {
            var context = new SocketInteractionContext(
                _client,
                interaction);

            var result = await _interactions.ExecuteCommandAsync(
                context,
                _services);

            if (result.IsSuccess)
            {
                return;
            }

            Console.Error.WriteLine(
                $"Interaction execution failed: {result.Error}.");

            var message = result.Error switch
            {
                InteractionCommandError.UnmetPrecondition =>
                    "You do not meet the requirements for this command.",

                InteractionCommandError.UnknownCommand =>
                    "This command is currently unavailable.",

                InteractionCommandError.BadArgs =>
                    "The command arguments are invalid.",

                _ => "The command could not be completed."
            };

            await SendErrorAsync(interaction, message);
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Interaction handling failed: {exception.GetType().Name}.");

            await SendErrorAsync(
                interaction,
                "An unexpected error occurred.");
        }
    }

    private static async Task SendErrorAsync(
        SocketInteraction interaction,
        string message)
    {
        try
        {
            if (interaction.HasResponded)
            {
                await interaction.FollowupAsync(
                    text: message,
                    ephemeral: true,
                    allowedMentions: AllowedMentions.None);
            }
            else
            {
                await interaction.RespondAsync(
                    text: message,
                    ephemeral: true,
                    allowedMentions: AllowedMentions.None);
            }
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Failed to send interaction response: " +
                $"{exception.GetType().Name}.");
        }
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        if (_initialized)
        {
            _client.Ready -= OnReadyAsync;
            _client.InteractionCreated -= OnInteractionCreatedAsync;
        }

        _disposed = true;
    }
}
