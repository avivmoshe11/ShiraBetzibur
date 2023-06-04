import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('pong').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction, client) {
        interaction.reply({ content: 'Pong', ephemeral: true });
    }
};
