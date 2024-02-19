import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { TextBasedChannel, VoiceBasedChannel } from 'discord.js';

class VoiceConnectionUtilities {
  private voiceConnection: VoiceConnection | undefined;
  private communicationChannel: TextBasedChannel | undefined;

  public connect(voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel): void {
    this.voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
    this.communicationChannel = textChannel;
  }

  public getCommunicationChannel(): TextBasedChannel | undefined {
    return this.communicationChannel;
  }

  public getConnection(): VoiceConnection | undefined {
    return this.voiceConnection;
  }

  public resetConnection(): void {
    this.voiceConnection?.destroy();
    this.voiceConnection = undefined;
    this.communicationChannel = undefined;
  }

  public checkCredibility(interaction: any): true | undefined {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ content: 'You are not in a voice channel.' });
      return;
    }

    if (!this.voiceConnection) {
      interaction.reply({ content: 'Bot is not playing anything.' });
      return;
    }

    if (this.voiceConnection.joinConfig.channelId != voiceChannel.id) {
      interaction.reply({ content: 'You are not in the same channel as the bot.' });
      return;
    }

    return true;
  }
}

export default new VoiceConnectionUtilities();
