# MessageBot

A Discord bot built with C# and Discord.Net, with a service-based architecture for slash commands and messaging.

## Features

- Discord connection lifecycle management.
- Slash command discovery and registration.
- Global or development-server command registration.
- Plain-text messaging with length validation.
- Mentions disabled when sending messages.
- Private interaction error responses.
- Graceful shutdown with Ctrl+C.

Command modules are still under development. Commands such as `/help` and `/say` are not included yet.

## Requirements

- .NET 8 SDK or later.
- A Discord application with a bot account.
- A Discord server where you can install and test the bot.
