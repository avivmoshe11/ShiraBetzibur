import { Client } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client: Client) {
    console.log(`Ready, client is now logged as ${client.user?.username}!`);
  }
};
