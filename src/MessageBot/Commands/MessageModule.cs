using Discord;
using Discord.Interactions;
using MessageBot.Services;

namespace MessageBot.Commands;

[RequireContext(ContextType.Guild)]
[RequireUserPermission(GuildPermission.Administrator)]
public sealed class MessageModule(MessageService messages)
    : InteractionModuleBase<SocketInteractionContext>
{
    [SlashCommand("say", "Send a message through the bot.")]
    public async Task SayAsync()
    {
        await RespondWithModalAsync<SayModal>("messagebot:say");
    }

    [ModalInteraction("messagebot:say")]
    public async Task SubmitSayAsync(SayModal modal)
    {
        await DeferAsync(ephemeral: true);

        await messages.SendAsync(
            Context.Channel,
            modal.Content);

        await FollowupAsync(
            text: "Message sent.",
            ephemeral: true);
    }
}

public sealed class SayModal : IModal
{
    public string Title => "Send a message";

    [InputLabel("Message")]
    [ModalTextInput(
        "content",
        TextInputStyle.Paragraph,
        placeholder: "Enter your message...",
        minLength: 1,
        maxLength: 2000)]
    [RequiredInput(true)]
    public string Content { get; set; } = string.Empty;
}
