using Discord;
using Discord.Interactions;

namespace MessageBot.Commands;

public sealed class GeneralModule
    : InteractionModuleBase<SocketInteractionContext>
{
    [SlashCommand("ping", "Check the bot's connection latency.")]
    public async Task PingAsync()
    {
        await RespondAsync(
            text: $"Pong! Gateway latency: {Context.Client.Latency} ms.",
            ephemeral: true,
            allowedMentions: AllowedMentions.None);
    }

    [SlashCommand("help", "Show the available commands.")]
    public async Task HelpAsync()
    {
        var embed = new EmbedBuilder()
            .WithTitle("MessageBot — Help")
            .WithDescription("Available slash commands.")
            .WithColor(new Color(88, 101, 242))
            .AddField(
                "/ping",
                "Displays the bot's Discord Gateway latency.")
            .AddField(
                "/help",
                "Displays this help message.")
            .AddField(
                "/say",
                "Opens a form and sends your message to the current channel. " +
                "Available to server administrators only.")
            .Build();

        await RespondAsync(
            embed: embed,
            ephemeral: true,
            allowedMentions: AllowedMentions.None);
    }
}
