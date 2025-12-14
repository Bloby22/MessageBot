// src/types/index.ts
import { Client, Collection, SlashCommandBuilder, ChatInputCommandInteraction, PermissionResolvable } from 'discord.js';

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    permissions?: PermissionResolvable[];
    cooldown?: number;
}

export interface ExtendedClient extends Client {
    commands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
}

export interface Config {
    token: string;
    clientId: string;
    guildId?: string;
    ownerId?: string;
    debug?: boolean;
}

export interface CommandOptions {
    name: string;
    description: string;
    options?: any[];
    permissions?: PermissionResolvable[];
    cooldown?: number;
}

export interface EmbedOptions {
    title?: string;
    description?: string;
    color?: number | string;
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnail?: string;
    image?: string;
    footer?: { text: string; iconURL?: string };
    timestamp?: boolean;
}

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: any;
}

export interface SuccessResponse {
    message: string;
    data?: any;
}

export type CommandCategory = 'utility' | 'moderation' | 'fun' | 'admin' | 'music' | 'economy';

export interface LoggerOptions {
    level: 'info' | 'success' | 'warning' | 'error' | 'debug';
    message: string;
    metadata?: any;
}
