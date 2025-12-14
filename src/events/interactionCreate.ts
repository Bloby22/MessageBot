import { Interaction, Collection } from 'discord.js';
import { ExtendedClient } from '../types';

export const once = false;

export const execute = async (interaction: Interaction, client: ExtendedClient): Promise<void> => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ Příkaz ${interaction.commandName} nebyl nalezen`);
        return;
    }

    if (command.permissions) {
        const memberPermissions = interaction.memberPermissions;
        if (!memberPermissions?.has(command.permissions)) {
            await interaction.reply({
                content: '❌ Nemáš oprávnění k použití tohoto příkazu!',
                ephemeral: true
            });
            return;
        }
    }

    if (command.cooldown) {
        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name)!;
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                await interaction.reply({
                    content: `⏳ Počkej ještě ${timeLeft.toFixed(1)}s před použitím \`${command.data.name}\`!`,
                    ephemeral: true
                });
                return;
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    try {
        console.log(`📝 ${interaction.user.tag} použil /${interaction.commandName}`);
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Chyba při spuštění příkazu ${interaction.commandName}:`, error);

        const errorMessage = {
            content: '❌ Nastala chyba při spuštění příkazu!',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
};

export default { once, execute };
