import Discord from 'discord.js';
import dotenv from 'dotenv';

import Join from './commands/join';
import Leave from './commands/leave';
import Ping from './commands/ping';

dotenv.config();

async function run() {
  const { DISCORD_TOKEN, COMMAND_PREFIX = '/' } = process.env;

  if (DISCORD_TOKEN == null) {
    throw new Error('DISCORD_TOKEN is required');
  }

  const client = new Discord.Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });

  client.on('message', (message) => {
    if (message.content.startsWith(COMMAND_PREFIX)) {
      const params = message.content.split(' ');
      const command = params[0].substring(1);

      switch (command) {
        case 'ping': {
          Ping(message);
          break;
        }
        case 'join': {
          Join(message);
          break;
        }
        case 'leave': {
          Leave(message);
          break;
        }
        default: {
          console.log(`Unsupported command: ${command}`);
          break;
        }
      }
    }
  });

  await client.login(DISCORD_TOKEN);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
