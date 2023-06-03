import { GuildMember, User } from 'discord.js';

export interface RoleLogger {
  positive: boolean;
  action: string;
  user: GuildMember | User;
  roleId: string;
}
