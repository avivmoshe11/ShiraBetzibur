import { SlashCommandBuilder, Client } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';
import { PlayerMode } from '../../Interfaces/player-interfaces.js';
import voiceConnectionUtilities from '../../Utilities/voice-connection-utilities.js';
import voiceRecognitionUtilities from '../../Utilities/voice-recognition-utilities.js';

export default {
  data: new SlashCommandBuilder().setName('listen').setDescription('listen'),
  async execute(interaction: any, client: Client) {
    if (playerUtilities.getPlayerMode() != PlayerMode.Sleep) return interaction.reply({ content: 'Must clear queues first.' });

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'You are not in a voice channel.' });

    const connection = voiceConnectionUtilities.getConnection();
    if (!connection) voiceConnectionUtilities.connect(voiceChannel, interaction.channel);
    voiceRecognitionUtilities.listenToUser();

    // connection?.receiver.speaking.on('start', () => {
    //   console.log('test;');
    //   connection.destroy();
    // });
  }
};
