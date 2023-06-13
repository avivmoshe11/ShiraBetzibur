import { SlashCommandBuilder, Client, ChatInputCommandInteraction } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('unpause').setDescription('unpause'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!playerUtilities.checkCredibility(interaction)) return;

    if (playerUtilities.unpause()) return await interaction.reply({ content: 'Unpaused!' });
    interaction.reply({ content: 'Unable to unpause now.' });
  }
};
