import { Collection } from 'discord.js';
import fs from 'fs';

async function loadCommands(client: any) {
  client.commands = new Collection();
  const commandsArray = [];

  const commandsFolder = fs.readdirSync('./dist/src/Commands');
  for (const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./dist/src/Commands/${folder}`).filter((file) => file.endsWith('js'));
    for (const file of commandFiles) {
      const commandFile = await import(`../Commands/${folder}/${file}`);
      client.commands.set(commandFile.default.data.name, commandFile.default);
      commandsArray.push(commandFile.default.data.toJSON());
      continue;
    }
  }

  client.application.commands.set(commandsArray);
}

export default loadCommands;
