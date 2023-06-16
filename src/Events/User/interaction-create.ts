import { CommandInteraction } from 'discord.js';

export default {
  name: 'interactionCreate',
  async execute(interaction: CommandInteraction, client: any) {
    let command;
    if (interaction.isChatInputCommand()) command = client.commands.get(interaction.commandName);
    if (command) command.execute(interaction, client);
  }
};
