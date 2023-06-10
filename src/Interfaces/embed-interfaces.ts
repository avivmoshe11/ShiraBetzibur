import { ColorResolvable } from 'discord.js';

export interface EmbedObject {
  color?: ColorResolvable;
  title?: string;
  description?: string;
  fields?: EmbedField[];
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface AdvancedEmbedObject extends EmbedObject {
  thumbnail?: string;
  url?: string;
  author?: string;
}
