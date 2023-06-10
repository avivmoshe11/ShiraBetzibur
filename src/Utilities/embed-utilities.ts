import { EmbedBuilder } from 'discord.js';
import { EmbedObject, AdvancedEmbedObject } from '../Interfaces/embed-interfaces';
import config from '../Config/config.js';

export function createEmbed(settings: EmbedObject) {
  const { color = '#000000', title = null, description = null, fields = [] } = settings;
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).addFields(fields);
}

export function createAdvancedEmbed(settings: AdvancedEmbedObject) {
  const { color = '#000000', author = null, title = null, thumbnail = null, url = null, description = null, fields = [] } = settings;
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setURL(url)
    .setAuthor({ name: `${author}` })
    .setThumbnail(thumbnail)
    .setDescription(description)
    .addFields(fields)
    .setFooter({
      text: `made by ${config.developer.username}`,
      iconURL: config.developer.iconUrl
    });
}

export default {
  createEmbed,
  createAdvancedEmbed
};
