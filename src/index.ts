import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import { config } from 'dotenv';
import { ExtendedClient } from './types';
import { loadCommands } from './handlers/commands';
import { loadEvents } from './handlers/events';

config();

const TOKEN = process.env.TOKEN!;

if (!TOKEN) {
    console.error('❌ TOKEN chybí v .env souboru!');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember
    ]
}) as ExtendedClient;

client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
    await loadCommands(client);
    loadEvents(client);
    await client.login(TOKEN);
})();

export { client };
