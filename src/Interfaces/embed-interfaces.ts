import { ColorResolvable } from 'discord.js';

export default interface EmbedObject {
  color?: ColorResolvable;
  title?: string;
  description?: string;
  fields?: EmbedField[];
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}
