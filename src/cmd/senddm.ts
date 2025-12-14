import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, User } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('senddm')
    .setDescription('Pošle embed zprávu do DM uživatele')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option
            .setName('uživatel')
            .setDescription('Vyber uživatele')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('barva')
            .setDescription('Barva embedu (např: Blue, Red, Green, #FF0000)')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('zpráva')
            .setDescription('Text zprávy')
            .setRequired(true)
    );

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const user = interaction.options.getUser('uživatel') as User;
    const colorInput = interaction.options.getString('barva')!;
    const message = interaction.options.getString('zpráva')!;

    let color: number;

    if (colorInput.startsWith('#')) {
        color = parseInt(colorInput.replace('#', ''), 16);
    } else {
        const colorMap: { [key: string]: number } = {
            'blue': 0x0099ff,
            'red': 0xff0000,
            'green': 0x00ff00,
            'yellow': 0xffff00,
            'purple': 0x9b59b6,
            'orange': 0xff9900,
            'pink': 0xff69b4,
            'black': 0x000000,
            'white': 0xffffff
        };
        color = colorMap[colorInput.toLowerCase()] || 0x009ff7;
    }

    try {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(message)
            .setTimestamp();

        await user.send({ embeds: [embed] });

        await interaction.reply({
            content: `✅ Zpráva úspěšně odeslána do DM uživatele ${user.tag}!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Chyba při odesílání DM:', error);
        await interaction.reply({
            content: `❌ Nepodařilo se odeslat DM uživateli ${user.tag}! Uživatel má pravděpodobně vypnuté DM zprávy.`,
            ephemeral: true
        });
    }
};

export default { data, execute };
