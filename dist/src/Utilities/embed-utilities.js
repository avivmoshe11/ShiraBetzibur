import { EmbedBuilder } from 'discord.js';
export function createEmbed(settings) {
    const { color = '#000000', title = '', description = '', fields = [] } = settings;
    return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).addFields(fields);
}
export default {
    createEmbed
};
