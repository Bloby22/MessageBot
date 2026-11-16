using Discord;
using Discord.Interactions;

namespace MessageBot.Commands;

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
