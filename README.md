# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/cassandra [![npm version](https://img.shields.io/npm/v/@purinton/cassandra.svg)](https://www.npmjs.com/package/@purinton/cassandra)[![license](https://img.shields.io/github/license/purinton/cassandra.svg)](LICENSE)[![build status](https://github.com/purinton/cassandra/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/cassandra/actions)

Cassandra is a modern, multi-language Discord bot designed for creative games, drawing prompts, and community engagement. It features modular commands, event handlers, and easy customization, making it ideal for art servers, game nights, and creative communities. Cassandra leverages OpenAI for AI-powered prompt generation and supports 30+ languages out of the box.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running as a Service (systemd)](#running-as-a-service-systemd)
- [Docker](#docker)
- [Customization](#customization)
  - [Commands](#commands)
  - [Events](#events)
  - [Locales](#locales)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

## Features

- AI-powered prompt generation using OpenAI for unique, creative drawing/game ideas
- Persistent prompt history stored in MySQL to avoid repeats
- Discord.js-based app with ESM support
- Command and event handler architecture for easy extension
- Multi-language/localized responses (30+ languages supported)
- Environment variable support via dotenv
- Logging and signal handling via `@purinton/common`
- Ready for deployment with systemd or Docker
- Jest for automated testing
- **/prompt** command for creative games and drawing inspiration
- Easy customization for commands, events, and locales

## Requirements

- Node.js v22+
- MySQL database (for prompt history)
- Discord bot token (see Discord Developer Portal)
- OpenAI API key

## Getting Started

1. **Clone this project:**

   ```bash
   git clone https://github.com/purinton/cassandra.git
   cd cassandra
   npm install
   ```

2. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your Discord app token, OpenAI API key, and MySQL credentials.
   - Edit `package.json` (name, description, author, etc.)
   - Update this `README.md` as needed.

3. **Start the app locally:**

   ```bash
   npm start
   # or
   node cassandra.mjs
   ```

## Configuration

All configuration is handled via environment variables in the `.env` file. See `.env.example` for required and optional variables. Key variables include:

- `DISCORD_TOKEN`: Your Discord bot token
- `OPENAI_API_KEY`: Your OpenAI API key
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`: MySQL connection details

## Running as a Service (systemd)

1. Copy `cassandra.service` to `/usr/lib/systemd/system/cassandra.service`.
2. Edit the paths and user/group as needed.
3. Reload systemd and start the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable cassandra
   sudo systemctl start cassandra
   sudo systemctl status cassandra
   ```

## Docker

1. Build the Docker image:

   ```bash
   docker build -t cassandra .
   ```

2. Run the container:

   ```bash
   docker run --env-file .env cassandra
   ```

## Customization

### Commands

- Add new commands in the `commands/` directory.
- Each command has a `.json` definition (for Discord registration/localization) and a `.mjs` handler (for logic).
- **Example:** To add a `/roll` command:
  1. Create `commands/roll.json` for the command definition.
  2. Create `commands/roll.mjs` for the handler logic.
  3. Restart the bot to auto-register the new command.

### Events

- Add or modify event handlers in the `events/` directory.
- Each Discord event (e.g., `ready`, `messageCreate`, `interactionCreate`) has its own handler file.

### Locales

- Add or update language files in the `locales/` directory.
- Localize command names, descriptions, and app responses. All 30+ Discord-supported languages are included and tested for completeness.

## Testing

- Run tests with:

  ```bash
  npm test
  ```

- Tests cover:
  - Command and event handler exports
  - Locale file completeness and validity
  - OpenAI prompt logic and error handling
- Add your tests in the `tests/` folder or alongside your code.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

You can also open issues or pull requests on [GitHub](https://github.com/purinton/cassandra).

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub Repo](https://github.com/purinton/cassandra)
- [GitHub Org](https://github.com/purinton)
- [GitHub Personal](https://github.com/rpurinton)
- [Discord](https://discord.gg/QSBxQnX7PF)
