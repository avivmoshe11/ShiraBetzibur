export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
        let command;
        if (interaction.isChatInputCommand())
            command = client.commands.get(interaction.commandName);
        if (command)
            command.execute(interaction, client);
    }
};
