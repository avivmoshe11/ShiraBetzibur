import roles from '../../Config/roles.js';
import loggerUtilities from '../../Utilities/logger-utilities.js';
export default {
    name: 'guildMemberAdd',
    async execute(member, client) {
        await member.roles.add(roles.member.id);
        const data = loggerUtilities.formatRoleLogger({ positive: true, action: 'Added Role', user: member, roleId: roles.member.id });
        loggerUtilities.log(client, data);
    }
};
