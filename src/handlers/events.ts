import { readdirSync } from 'fs';
import { join } from 'path';
import { ExtendedClient } from '../types';

export const loadEvents = (client: ExtendedClient): void => {
    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(join(eventsPath, file));
        const eventName = file.split('.')[0];

        if (event.once) {
            client.once(eventName, (...args) => event.execute(...args, client));
        } else {
            client.on(eventName, (...args) => event.execute(...args, client));
        }

        console.log(`✅ Načten event: ${eventName}`);
    }
};

export default loadEvents;
