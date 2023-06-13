import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import { TextBasedChannel, User, VoiceBasedChannel } from 'discord.js';
import { QueueEntry, Song } from '../Interfaces/player-interfaces';
import embedUtilities from './embed-utilities.js';
import { AdvancedEmbedObject, EmbedField } from '../Interfaces/embed-interfaces';

class PlayerUtilities {
  private connection: VoiceConnection | undefined;
  private requestedChannel: TextBasedChannel | undefined;
  private player = createAudioPlayer();
  private queue: QueueEntry[];

  constructor() {
    this.queue = [];
    this.player.on(AudioPlayerStatus.Idle, () => {
      this.queue.shift();
      this.play();
    });
  }

  async play() {
    if (this.player.state.status != AudioPlayerStatus.Idle) return;
    const song = this.queue[0];

    if (song) {
      this.connection?.subscribe(this.player);
      this.player.play(song.resource);

      const embed = embedUtilities.createAdvancedEmbed(this.modifySongToEmbedFormat(song));
      this.requestedChannel?.send({ embeds: [embed] });
    } else {
      this.destroy();
    }
  }

  connect(voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel) {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
    this.requestedChannel = textChannel;
  }

  getConnection() {
    return this.connection;
  }

  async getSong(query: string, user: User) {
    let song: Song | undefined;

    if (ytdl.validateURL(query)) {
      const songInfo = await ytdl.getInfo(query);
      const songDetails = songInfo.videoDetails;
      song = {
        title: songDetails.title,
        url: songDetails.video_url,
        author: songDetails.ownerChannelName,
        length: this.formatTimeStamp(Number(songDetails.lengthSeconds)),
        thumbnail: songDetails.thumbnails[0].url,
        requestedBy: user.username
      };
    } else {
      const videoResults = await ytSearch(query);
      const video = videoResults.videos[0];
      if (video) {
        song = {
          title: video.title,
          url: video.url,
          author: video.author.name,
          length: this.formatTimeStamp(video.seconds),
          thumbnail: video.thumbnail,
          requestedBy: user.username
        };
      }
    }

    return song;
  }

  addResourceToQueue(song: Song) {
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const queueEntry = { ...song, resource: createAudioResource(stream) };
    this.queue.push(queueEntry);
  }

  formatTimeStamp(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  modifySongToEmbedFormat(details: QueueEntry) {
    const { title, author, length, requestedBy, thumbnail, url } = details;

    const subObj: EmbedField[] = [
      { name: 'Duration', value: length, inline: true },
      { name: 'Requested By', value: requestedBy, inline: true }
    ];

    const obj: AdvancedEmbedObject = {
      title: title,
      url: url,
      author: author,
      thumbnail: thumbnail,
      fields: subObj
    };

    return obj;
  }

  destroy() {
    this.connection?.destroy();
    this.connection = undefined;
    this.requestedChannel = undefined;
    this.queue.splice(0);
    this.skip();
  }

  skip() {
    this.player.stop(true);
  }

  pause() {
    if (this.player.state.status == AudioPlayerStatus.Playing) {
      return this.player.pause();
    }
    return false;
  }

  unpause() {
    if (this.player.state.status == AudioPlayerStatus.Paused) {
      return this.player.unpause();
    }
    return false;
  }

  checkCredibility(interaction: any) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ content: 'You are not in a voice channel.' });
      return;
    }

    if (!this.connection) {
      interaction.reply({ content: 'Bot is not playing anything.' });
      return;
    }

    if (this.connection.joinConfig.channelId != voiceChannel.id) {
      interaction.reply({ content: 'You are not in the same channel as the bot.' });
      return;
    }

    return true;
  }
}

export default new PlayerUtilities();
