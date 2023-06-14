import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import googleTTSApi from 'google-tts-api';
import { createWriteStream, unlink } from 'fs';
import { pipeline } from 'stream';
import axios from 'axios';
import { TextBasedChannel, User, VoiceBasedChannel } from 'discord.js';
import { SongQueueEntry, Song, TTSQueueEntry, PlayerMode } from '../Interfaces/player-interfaces.js';
import embedUtilities from './embed-utilities.js';
import { AdvancedEmbedObject, EmbedField } from '../Interfaces/embed-interfaces.js';
//import { PlayerMode } from '../Types/player.js';

class PlayerUtilities {
  private connection: VoiceConnection | undefined;
  private requestedChannel: TextBasedChannel | undefined;
  private player = createAudioPlayer();
  private songQueue: SongQueueEntry[];
  private ttsQueue: TTSQueueEntry[];
  private ttsNumber: number = 0;
  private playerMode: number;

  constructor() {
    this.songQueue = [];
    this.ttsQueue = [];
    this.playerMode = PlayerMode.Sleep;

    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.songQueue.length) {
        this.songQueue.shift();
        this.play();
      } else if (this.ttsQueue.length) {
        this.removeAudioFile(this.ttsQueue[0]?.path);
        this.ttsQueue.shift();
        this.playTTS();
      }
    });
  }

  async play() {
    if (this.player.state.status != AudioPlayerStatus.Idle) return;
    if (this.playerMode == PlayerMode.Sleep) this.playerMode = PlayerMode.Music;
    const song = this.songQueue[0];

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
    this.songQueue.push(queueEntry);
  }

  formatTimeStamp(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  modifySongToEmbedFormat(details: SongQueueEntry) {
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
    this.songQueue.splice(0);
    this.ttsQueue.splice(0);
    this.ttsNumber = 0;
    this.playerMode = PlayerMode.Sleep;
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

  async playTTS() {
    if (this.player.state.status != AudioPlayerStatus.Idle) return;
    if (this.playerMode == PlayerMode.Sleep) this.playerMode = PlayerMode.TTS;
    const entry = this.ttsQueue[0];

    if (entry) {
      this.connection?.subscribe(this.player);
      this.player.play(entry.audio);
    } else {
      this.destroy();
    }
  }

  async addResourceToTTSQueue(input: string) {
    const audioFilePath = await this.generateTTS(input);
    const resource = createAudioResource(audioFilePath);
    this.ttsQueue.push({ path: audioFilePath, audio: resource });
  }

  removeAudioFile(path: string) {
    unlink(path, (err) => {
      if (err) return false;
      return true;
    });
  }

  async generateTTS(input: string) {
    const audioFilePath = `./dist/src/Audio/tts_audio${this.ttsNumber}.mp3`;
    const hebrewRegex = /^[\u0590-\u05FF\s0-9,.?!'"():;{}\[\]\-]*$/;
    const url = googleTTSApi.getAudioUrl(input, { lang: hebrewRegex.test(input) ? 'he' : 'en', slow: false });
    const response = await axios.get(url, { responseType: 'stream' });
    const writeStream = createWriteStream(audioFilePath);

    if (
      pipeline(response.data, writeStream, (error) => {
        if (error) return false;
        return true;
      })
    )
      this.ttsNumber += 1;
    return audioFilePath;
  }

  getPlayerMode() {
    return this.playerMode;
  }
}

export default new PlayerUtilities();
