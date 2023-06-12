import { SlashCommandBuilder, PermissionFlagsBits, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('leave').setDescription('leave'),

  async execute(interaction: any, client: Client) {
    if (!playerUtilities.checkCredibility(interaction)) return;

    await interaction.reply({ content: 'Ok byeeeee.' });
    playerUtilities.destroy();
  }
};
