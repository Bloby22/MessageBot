import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, version } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Zobrazí informace o botovi');

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const embed = new EmbedBuilder()
        .setColor(0x009ff7)
        .setTitle('ℹ️ Informace o botovi')
        .setThumbnail(interaction.client.user?.displayAvatarURL() || '')
        .addFields(
            {
                name: '🤖 Bot',
                value: `**Jméno:** ${interaction.client.user?.tag}\n**ID:** ${interaction.client.user?.id}`,
                inline: false
            },
            {
                name: '📊 Statistiky',
                value: `**Servery:** ${interaction.client.guilds.cache.size}\n**Uživatelé:** ${totalMembers}`,
                inline: false
            },
            {
                name: '⏱️ Uptime',
                value: uptimeString,
                inline: false
            },
            {
                name: '💻 Systém',
                value: `**Node.js:** ${process.version}\n**Discord.js:** v${version}\n**Ping:** ${interaction.client.ws.ping}ms`,
                inline: false
            },
            {
                name: '📅 Vytvořen',
                value: `<t:${Math.floor(interaction.client.user!.createdTimestamp / 1000)}:R>`,
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
