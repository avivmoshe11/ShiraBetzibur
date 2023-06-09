import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client } from 'discord.js';
import { play } from '../../Utilities/player-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('play').setDescription('play').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute(interaction: any, client: Client) {
    play(interaction.member?.voice.channel);
    interaction.reply({ content: 'Pong', ephemeral: true });
  }
};
