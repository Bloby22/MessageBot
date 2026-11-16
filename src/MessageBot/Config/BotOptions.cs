using System.ComponentModel.DataAnnotations;
using Discord;

namespace MessageBot.Config;

/// <summary>
/// Configuration bound to the "Bot" section of appsettings.json.
/// The bot token is supplied separately through DISCORD_BOT_TOKEN.
/// </summary>
public sealed class BotOptions
{
    public const string SectionName = "Bot";

    [EnumDataType(typeof(UserStatus))]
    public UserStatus Status { get; set; } = UserStatus.Online;

    [Required]
    public BotActivityOptions Activity { get; set; } = new();
}

/// <summary>
/// Configures the activity displayed on the bot's Discord profile.
/// </summary>
public sealed class BotActivityOptions
{
    [EnumDataType(typeof(ActivityType))]
    public ActivityType Type { get; set; } = ActivityType.Playing;

    [Required]
    [StringLength(128, MinimumLength = 1)]
    public string Name { get; set; } = "/help";
}
