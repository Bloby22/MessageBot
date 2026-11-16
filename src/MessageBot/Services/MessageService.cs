using Discord;
namespace MessageBot.Services;

/// Sends plain-text messages to Discord Channels
public sealed class MessageService
{
    private const int MaxMessageLength = 2_000;

    /// Sends a message with mentions disabled
    /// Discord permission and network errors propagate to the caller
    public async Task<IUserMessage> SendAsync(
        IMessageChannel channel,
        string content,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(channel);

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Message content cannot be empty",
                nameof(content));
        }

        if (content.Length > MaxMessageLength)
        {
            throw new ArgumentException(
                $"Message content cannot exceed {MaxMessageLength} characters",
                nameof(content));
        }

        cancellationToken.ThrowIfCancellationRequested();

        return await channel.SendMessageAsync(
            text: content,
            allowedMentions: AllowedMentions.None,
            options: new RequestOptions
            {
                CancelToken = cancellationToken
            });
    }
}
