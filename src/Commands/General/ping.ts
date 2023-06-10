import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Client } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('pong').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute(interaction: ChatInputCommandInteraction, client: Client) {
    for (let i = 0; i < 400; i++) {
      interaction.channel?.send({
        content: 'nigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\nnigger\n'
      });
    }

    interaction.reply({ content: 'Pong', ephemeral: true });
  }
};
