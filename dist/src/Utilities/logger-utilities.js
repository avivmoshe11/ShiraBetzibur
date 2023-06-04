import embedUtilities from './embed-utilities.js';
import channels from '../Config/channels.js';
export function log(client, details) {
    const logChannel = client.guilds.cache.first()?.channels.cache.get(channels.log.id);
    logChannel.send({ embeds: [embedUtilities.createEmbed(details)] });
}
export function formatRoleLogger(details) {
    const obj = {
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
