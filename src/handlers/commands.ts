import { readdirSync } from 'fs';
import { join } from 'path';
import { ExtendedClient } from '../types';
import { REST, Routes } from 'discord.js';

export const loadCommands = async (client: ExtendedClient): Promise<void> => {
    const commandsPath = join(__dirname, '../cmd');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const commands: any[] = [];

    for (const file of commandFiles) {
        const command = require(join(commandsPath, file));
        
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Načten příkaz: ${command.data.name}`);
        } else {
            console.log(`⚠️ Příkaz ${file} nemá 'data' nebo 'execute'`);
        }
    }

    const TOKEN = process.env.TOKEN!;
    const CLIENT_ID = process.env.CLIENT_ID!;

    if (!TOKEN || !CLIENT_ID) {
        console.error('❌ TOKEN nebo CLIENT_ID chybí v .env souboru!');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log('🔄 Registruji slash commands...');
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        
        console.log(`✅ Úspěšně zaregistrováno ${commands.length} slash commands!`);
    } catch (error) {
        console.error('❌ Chyba při registraci slash commands:', error);
    }
};

export default loadCommands;
