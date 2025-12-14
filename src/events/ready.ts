import { ActivityType } from 'discord.js';
import { ExtendedClient } from '../types';

export const once = true;

export const execute = async (client: ExtendedClient): Promise<void> => {
    console.log('═══════════════════════════════════════');
    console.log(`✅ Bot je online jako ${client.user?.tag}`);
    console.log(`📊 Servery: ${client.guilds.cache.size}`);
    console.log(`👥 Uživatelé: ${client.users.cache.size}`);
    console.log(`💬 Příkazy: ${client.commands.size}`);
    console.log('═══════════════════════════════════════');

    if (client.user) {
        client.user.setActivity('💬 Koukám na Slashy...', { 
            type: ActivityType.Watching 
        });
    }
};

export default { once, execute };
