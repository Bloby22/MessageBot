import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zobrazím ti seznam dostupných příkazů, co mám.');

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const embed = new EmbedBuilder()
        .setColor(0x009ff7)
        .setTitle('📚 Nápověda - Seznam příkazů')
        .setDescription('Zde jsou všechny dostupné příkazy:')
        .addFields(
            {
                name: '🛠️ Utility',
                value: '`/ping` - Zkontroluje odezvu bota z serveru Pterodactylu.\n`/help` - Zobrazí tuto nápovědu s přehledem příkazů.\n`/info` - Informace o botovi.\n`/stats` - Statistiky bota.',
                inline: false
            },
            {
                name: '📨 Zprávy',
                value: '`/send` - Pošle embed zprávu do kanálu.\n`/sendpz` - Pošle pokročilou zprávu.',
                inline: false
            },
            {
                name: '🔗 Odkazy',
                value: '`/invite` - Pozvánka pro bota.\n`/support` - Podporní server.',
                inline: false
            }
        )
        .setThumbnail(interaction.client.user?.displayAvatarURL() || '')
        .setFooter({
            text: `Požádal: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
};

export default { data, execute };
