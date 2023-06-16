import loggerUtilities from '../../Utilities/logger-utilities.js';
import { Client, GuildMember } from 'discord.js';
import roles from '../../Config/roles.js';

export default {
  name: 'guildMemberAdd',
  async execute(member: GuildMember, client: Client) {
    await member.roles.add(roles.member.id);
    const data = loggerUtilities.formatRoleLogger({ positive: true, action: 'Added Role', user: member, roleId: roles.member.id });
    loggerUtilities.log(client, data);
  }
};
