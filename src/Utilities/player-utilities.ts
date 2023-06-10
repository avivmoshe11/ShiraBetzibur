import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import { TextBasedChannel, User, VoiceBasedChannel } from 'discord.js';
import { QueueEntry, Song } from '../Interfaces/player-interfaces';
import embedUtilities from './embed-utilities.js';
import { AdvancedEmbedObject, EmbedField } from '../Interfaces/embed-interfaces';

let connection: VoiceConnection | undefined;
let requestedChannel: TextBasedChannel | undefined;
const player = createAudioPlayer();
const queue: QueueEntry[] = [];

export async function play() {
  if (player.state.status != AudioPlayerStatus.Idle) return;
  const song = queue[0];
  if (song) {
    connection?.subscribe(player);
    player.play(song.resource);

    const embed = embedUtilities.createAdvancedEmbed(modifySongToEmbedFormat(song));
    requestedChannel?.send({ embeds: [embed] });
  } else {
    destroy();
  }
}

export function connect(voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel) {
  connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guildId,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });
  requestedChannel = textChannel;
}

export function getConnection() {
  return connection;
}

export async function getSong(query: string, user: User) {
  let song: Song | undefined;

  if (ytdl.validateURL(query)) {
    const songInfo = await ytdl.getInfo(query);
    const songDetails = songInfo.videoDetails;
    song = {
      title: songDetails.title,
      url: songDetails.video_url,
      author: songDetails.ownerChannelName,
      length: formatTimeStamp(Number(songDetails.lengthSeconds)),
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
        length: formatTimeStamp(video.seconds),
        thumbnail: video.thumbnail,
        requestedBy: user.username
      };
    }
  }

  return song;
}

export function addResourceToQueue(song: Song) {
  const stream = ytdl(song.url, { filter: 'audioonly' });
  const queueEntry = { ...song, resource: createAudioResource(stream) };
  queue.push(queueEntry);
}

function formatTimeStamp(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function modifySongToEmbedFormat(details: QueueEntry) {
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

export function destroy() {
  connection?.destroy();
  connection = undefined;
  requestedChannel = undefined;
}

player.on(AudioPlayerStatus.Idle, () => {
  queue.shift();
  play();
});

export default {
  play,
  connect,
  getConnection,
  getSong,
  addResourceToQueue
};
