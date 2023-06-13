import { SlashCommandBuilder, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';
import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play')
    .addStringOption((option) => option.setName('song-request').setDescription('add a song name or a youtube link').setRequired(true)),

  async execute(interaction: any, client: Client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You are not in a voice channel.' });

    const query: string = interaction.options.get('song-request')?.value;
    const song = await playerUtilities.getSong(query, interaction.user);

    if (!song) return interaction.reply({ content: 'Internal Error - invalid song query' });
    playerUtilities.addResourceToQueue(song);
    interaction.reply({ content: `Enqueued \`${song.title}\`.` });

    const connection = playerUtilities.getConnection();
    if (!connection) playerUtilities.connect(voiceChannel, interaction.channel);

    if (AudioPlayerStatus.Idle) playerUtilities.play();
  }
};
