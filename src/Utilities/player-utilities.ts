import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection, AudioResource } from '@discordjs/voice';
import { SongQueueEntry, Song, PlayerMode } from '../Interfaces/player-interfaces.js';
import { AdvancedEmbedObject, EmbedField } from '../Interfaces/embed-interfaces.js';
import { TextBasedChannel, User, VoiceBasedChannel } from 'discord.js';
import embedUtilities from './embed-utilities.js';
import googleTTSApi from 'google-tts-api';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';

class PlayerUtilities {
  private connection: VoiceConnection | undefined;
  private requestedChannel: TextBasedChannel | undefined;
  private player = createAudioPlayer();
  private songQueue: SongQueueEntry[];
  private ttsQueue: AudioResource[];
  private playerMode: number;

  constructor() {
    this.songQueue = [];
    this.ttsQueue = [];
    this.playerMode = PlayerMode.Sleep;

    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.playerMode == PlayerMode.Music) {
        this.songQueue.shift();
      } else if (this.playerMode == PlayerMode.TTS) {
        this.ttsQueue.shift();
      } else return;
      this.play(this.playerMode);
    });
  }

  /* Connection and subscription related methods to help build the voice connection.
     Methods:
     - connect: Connects the client to a voiceBasedChannel and sets the channel of the text interactions regarding the connection.
     - getConnection: Returns the current connection session.
     - subscribeAndPlay: Connection subscribes to player and plays resource.
     - getPlayerMode: Returns the current player mode.
     - destroy: Disconnects from the session, resets all session related parameters and clearing the player.
  */
  connect(voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel): void {
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
    this.requestedChannel = textChannel;
  }

  getConnection(): VoiceConnection | undefined {
    return this.connection;
  }

  subscribeAndPlay(resource: AudioResource): void {
    this.connection?.subscribe(this.player);
    this.player.play(resource);
  }

  getPlayerMode(): PlayerMode {
    return this.playerMode;
  }

  destroy(): void {
    this.connection?.destroy();
    this.connection = undefined;
    this.requestedChannel = undefined;
    this.songQueue.splice(0);
    this.ttsQueue.splice(0);
    this.playerMode = PlayerMode.Sleep;
    this.skip();
  }

  /* Song/Sound fetch and enqueuing methods to find the correct streams and make them usable.
     Methods:
     - getSong: Returns a Song type object built by the details of the song by query.
     - generateTTS: Returns a stream output of the tts query.
     - addResourceToQueue: Builds a stream output and inserts it into SongQueue.
     - addResourceToTTSQueue: Adds a stream output to the TTSQueue.
   */
  async getSong(query: string, user: User): Promise<Song | undefined> {
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

  async generateTTS(input: string): Promise<any> {
    const hebrewRegex = /^[\u0590-\u05FF\s0-9,.?!'"():;{}\[\]\-]*$/;
    const url = googleTTSApi.getAudioUrl(input, { lang: hebrewRegex.test(input) ? 'he' : 'en', slow: false });
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
  }

  addResourceToQueue(song: Song): void {
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const queueEntry: SongQueueEntry = { ...song, resource: createAudioResource(stream) };
    this.songQueue.push(queueEntry);
  }

  async addResourceToTTSQueue(input: string): Promise<void> {
    const stream = await this.generateTTS(input);
    const resource = createAudioResource(stream);
    this.ttsQueue.push(resource);
  }

  /* Player controlling methods
     Methods:
     - play: Receives a player mode and plays a resource from the desired queue related to the mode.
     - skip: Stops the current resource.
     - pause: Pauses the resource the player is currently playing.
     - unpause: Unpauses the resource the player is currently playing.
   */
  async play(mode: PlayerMode): Promise<void> {
    if (this.player.state.status != AudioPlayerStatus.Idle) return;
    if (this.playerMode == PlayerMode.Sleep) this.playerMode = mode;

    let entry: any;
    if (this.playerMode == PlayerMode.Music) entry = this.songQueue[0];
    else if (this.playerMode == PlayerMode.TTS) entry = this.ttsQueue[0];

    if (entry) {
      if (this.playerMode == PlayerMode.Music) {
        this.subscribeAndPlay(entry.resource);

        const embed = embedUtilities.createAdvancedEmbed(this.modifySongToEmbedFormat(entry));
        this.requestedChannel?.send({ embeds: [embed] });
      } else {
        this.subscribeAndPlay(entry);
      }
    } else {
      this.destroy();
    }
  }

  skip(): void {
    this.player.stop(true);
  }

  pause(): boolean {
    if (this.player.state.status == AudioPlayerStatus.Playing) {
      return this.player.pause();
    }
    return false;
  }

  unpause(): boolean {
    if (this.player.state.status == AudioPlayerStatus.Paused) {
      return this.player.unpause();
    }
    return false;
  }

  /* General methods for that assists the client handle the some player related values easily.
     Methods:
     - checkCredibility: Checks if the user is credible for making player controlling commands.
     - formatTimeStamp: Formats seconds into 00:00:00 hours:minute:seconds format.
     - modifySongToEmbedFormat: Formats the Song object into a designed embed.
  */
  checkCredibility(interaction: any): true | undefined {
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

  formatTimeStamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  modifySongToEmbedFormat(details: SongQueueEntry): AdvancedEmbedObject {
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
}

export default new PlayerUtilities();
