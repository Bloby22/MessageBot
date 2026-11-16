using System.ComponentModel.DataAnnotations;

namespace MessageBot.Config;

/// <summary>
/// Configuration bound to the "Messages" section of appsettings.json.
/// </summary>
public sealed class MessageOptions
{
    public const string SectionName = "Messages";

    /// <summary>
    /// Maximum permitted length of an outgoing text message.
    /// </summary>
    [Range(1, 2000)]
    public int MaxLength { get; set; } = 2000;

    /// <summary>
    /// Determines whether outgoing messages may notify mentioned users,
    /// roles, or everyone.
    /// </summary>
    public bool AllowMentions { get; set; } = false;
}
