import embedUtilities from './embed-utilities.js';
import channels from '../Config/channels.js';
import { Client, GuildTextBasedChannel } from 'discord.js';
import { RoleLogger } from '../Interfaces/logger-interfaces.js';
import { EmbedObject } from '../Interfaces/embed-interfaces.js';

export function log(client: Client, details: EmbedObject) {
  const logChannel: GuildTextBasedChannel = client.guilds.cache.first()?.channels.cache.get(channels.log.id) as GuildTextBasedChannel;

  logChannel.send({ embeds: [embedUtilities.createEmbed(details)] });
}

export function formatRoleLogger(details: RoleLogger) {
  const obj: EmbedObject = {
    color: details.positive ? 'Green' : 'Red',
    title: details.action,
    description: `The role <@&${details.roleId}> ${details.positive ? 'was added to' : 'was removed from'} <@${details.user.id}>`
  };

  return obj;
}

export default {
  log,
  formatRoleLogger
};
