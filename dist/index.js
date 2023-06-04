import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import loadCommands from './src/Handlers/command-handler.js';
import loadEvents from './src/Handlers/event-handler.js';
import './src/Handlers/error-handlers.js';
dotenv.config();
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildScheduledEvents, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildScheduledEvents, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember]
});
client.login(process.env.TOKEN).then(async () => {
    await loadEvents(client);
    await loadCommands(client);
});
export default client;
