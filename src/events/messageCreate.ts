import { Message, Collection } from 'discord.js';
import { ExtendedClient } from '../types';

export const once = false;

export const execute = async (message: Message, client: ExtendedClient): Promise<void> => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefix = process.env.PREFIX || '/';

    if (!message.content.startsWith(prefix)) return;

    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = client.commands.get(commandName);

    if (!command) return;

    if (command.permissions) {
        const memberPermissions = message.member?.permissions;
        if (!memberPermissions?.has(command.permissions)) {
            await message.reply('❌ Nemáš oprávnění k použití tohoto příkazu!');
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

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                await message.reply(`⏳ Počkej ještě ${timeLeft.toFixed(1)}s před použitím \`${command.data.name}\`!`);
                return;
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        console.log(`📝 ${message.author.tag} použil ${prefix}${commandName}`);
        await command.execute(message as any);
    } catch (error) {
        console.error(`❌ Chyba při spuštění příkazu ${commandName}:`, error);
        await message.reply('❌ Nastala chyba při spuštění příkazu!');
    }
};

export default { once, execute };
