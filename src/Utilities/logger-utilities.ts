import { RoleLogger } from '../Interfaces/logger-interfaces.js';
import { EmbedObject } from '../Interfaces/embed-interfaces.js';
import { Client, GuildTextBasedChannel } from 'discord.js';
import embedUtilities from './embed-utilities.js';
import channels from '../Config/channels.js';

class LoggerUtilities {
  log(client: Client, details: EmbedObject): void {
    const logChannel = channels.references?.get(channels.log.id) as GuildTextBasedChannel;

    logChannel.send({ embeds: [embedUtilities.createEmbed(details)] });
  }

  formatRoleLogger(details: RoleLogger): EmbedObject {
    const obj: EmbedObject = {
      color: details.positive ? 'Green' : 'Red',
      title: details.action,
      description: `The role <@&${details.roleId}> ${details.positive ? 'was added to' : 'was removed from'} <@${details.user.id}>`
    };

    return obj;
  }
}
export default new LoggerUtilities();
