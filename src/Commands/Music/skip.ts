import { SlashCommandBuilder, Client, ChatInputCommandInteraction } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('skip').setDescription('skip'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!playerUtilities.checkCredibility(interaction)) return;

    await interaction.reply({ content: 'Skipping...' });
    playerUtilities.skip();
  }
};