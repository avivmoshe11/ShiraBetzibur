import { EmbedBuilder } from 'discord.js';
import EmbedObject from '../Interfaces/embed-interfaces';

export function createEmbed(settings: EmbedObject) {
  const { color = '#000000', title = '', description = '', fields = [] } = settings;
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).addFields(fields);
}

export default {
  createEmbed
};
