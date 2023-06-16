import { SlashCommandBuilder, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { PlayerMode } from '../../Interfaces/player-interfaces.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('tts')
    .addStringOption((option) => option.setName('tts-message').setDescription('add a song name or a youtube link').setRequired(true)),

  async execute(interaction: any, client: Client) {
    if (playerUtilities.getPlayerMode() == PlayerMode.Music) return interaction.reply({ content: "Bot is currently in 'Music' mode." });

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You are not in a voice channel.' });

    const query: string = interaction.options.get('tts-message')?.value;
    await playerUtilities.addResourceToTTSQueue(query);

    const connection = playerUtilities.getConnection();
    if (!connection) playerUtilities.connect(voiceChannel, interaction.channel);

    interaction.reply({ content: `Enqueueing ${query}` });

    if (AudioPlayerStatus.Idle) await playerUtilities.play(PlayerMode.TTS);
  }
};
