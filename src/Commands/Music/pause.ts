import { SlashCommandBuilder, PermissionFlagsBits, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('pause').setDescription('pause'),

  async execute(interaction: any, client: Client) {
    if (!playerUtilities.checkCredibility(interaction)) return;

    if (playerUtilities.pause()) return await interaction.reply({ content: 'Paused!' });
    interaction.reply({ content: 'Unable to pause now.' });
  }
};
