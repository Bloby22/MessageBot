import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Zobrazí Discord statistiky bota a serveru');

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({
            content: '❌ Tento příkaz lze použít pouze na serveru!',
            ephemeral: true
        });
        return;
    }

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const totalChannels = interaction.client.channels.cache.size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    const onlineMembers = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humans = guild.memberCount - bots;

    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount || 0;

    const embed = new EmbedBuilder()
        .setColor(0x009ff7)
        .setTitle('📊 Discord Statistiky')
        .setThumbnail(guild.iconURL() || '')
        .addFields(
            {
                name: '🤖 Bot Globální',
                value: `**Servery:** ${interaction.client.guilds.cache.size}\n**Celkem členů:** ${totalMembers}\n**Celkem kanálů:** ${totalChannels}\n**Uptime:** ${uptimeString}`,
                inline: false
            },
            {
                name: '🏠 Tento Server',
                value: `**Jméno:** ${guild.name}\n**ID:** ${guild.id}\n**Vlastník:** <@${guild.ownerId}>\n**Vytvořen:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                inline: false
            },
            {
                name: '👥 Členové',
                value: `**Celkem:** ${guild.memberCount}\n**Lidé:** ${humans}\n**Boti:** ${bots}\n**Online:** ${onlineMembers}`,
                inline: false
            },
            {
                name: '📺 Kanály',
                value: `**Celkem:** ${guild.channels.cache.size}\n**Textové:** ${textChannels}\n**Hlasové:** ${voiceChannels}\n**Kategorie:** ${categories}`,
                inline: false
            },
            {
                name: '🎭 Role',
                value: `**Počet:** ${guild.roles.cache.size}\n**Nejvyšší:** ${guild.roles.highest}`,
                inline: false
            },
            {
                name: '💎 Boost',
                value: `**Level:** ${boostLevel}\n**Boosty:** ${boostCount}`,
                inline: false
            },
            {
                name: '😀 Emoji',
                value: `**Počet:** ${guild.emojis.cache.size}\n**Animované:** ${guild.emojis.cache.filter(e => e.animated).size}`,
                inline: false
            },
            {
                name: '🔗 Ostatní',
                value: `**Ping:** ${interaction.client.ws.ping}ms\n**Verifikace:** ${guild.verificationLevel}\n**AFK Timeout:** ${guild.afkTimeout}s`,
                inline: false
            }
        )
        .setFooter({
            text: `Požádal: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
};

export default { data, execute };
