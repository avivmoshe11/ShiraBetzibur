import { EmbedObject, EmbedField } from '../../Interfaces/embed-interfaces.js';
import embedUtilities from '../../Utilities/embed-utilities.js';
import { Client, Message, TextBasedChannel } from 'discord.js';
import channels from '../../Config/channels.js';

export default {
  name: 'messageDelete',
  async execute(message: Message, client: Client) {
    if (message.author?.id == client.user?.id) return;

    const guild = message.guild;
    const fetchedLogs = await guild?.fetchAuditLogs({
      limit: 1,
      type: 72
    });
    const deletionLog = fetchedLogs?.entries.first();
    console.log(deletionLog);

    const fields: EmbedField[] = [
      { name: 'Deleted By', value: `<@${deletionLog?.executorId}>`, inline: true },
      { name: 'Message By', value: `<@${message.author.id}>`, inline: true },
      { name: 'Channel', value: `<#${message.channelId}>`, inline: true }
    ];

    const EmbedObject: EmbedObject = {
      color: 'Red',
      title: `Message Deleted`,
      description: message.content,
      fields: fields
    };

    const logChannel = channels.references?.get(channels.log.id) as TextBasedChannel;
    logChannel.send({ embeds: [embedUtilities.createEmbed(EmbedObject)] });
  }
};
