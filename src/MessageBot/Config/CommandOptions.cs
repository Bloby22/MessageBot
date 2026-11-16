namespace MessageBot.Config;

/// <summary>
/// Configuration bound to the "Commands" section of appsettings.json.
/// </summary>
public sealed class CommandOptions
{
    public const string SectionName = "Commands";

    /// <summary>
    /// Registers commands to this server during development.
    /// A null value selects global registration.
    /// </summary>
    public ulong? DevelopmentGuildId { get; set; }

    /// <summary>
    /// Determines whether commands are registered when the bot starts.
    /// </summary>
    public bool RegisterOnStartup { get; set; } = true;
}
