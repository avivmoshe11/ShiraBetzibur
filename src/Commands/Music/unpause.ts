import { SlashCommandBuilder, PermissionFlagsBits, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('unpause').setDescription('unpause'),

  async execute(interaction: any, client: Client) {
    if (!playerUtilities.checkCredibility(interaction)) return;

    if (playerUtilities.unpause()) return await interaction.reply({ content: 'Unpaused!' });
    interaction.reply({ content: 'Unable to unpause now.' });
  }
};
