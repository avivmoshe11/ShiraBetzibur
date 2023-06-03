import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('pong').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute(interaction: ChatInputCommandInteraction, client: Client) {
    interaction.reply({ content: 'Pong', ephemeral: true });
  }
};
