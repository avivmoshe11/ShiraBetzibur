import { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import { VoiceBasedChannel } from 'discord.js';

export async function play(channel: VoiceBasedChannel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  const videos = await ytSearch('Rat Irl');
  const song = { title: videos.videos[0].title, url: videos.videos[0].url };
  const player = createAudioPlayer();
  const stream = ytdl(song.url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  connection.subscribe(player);
  player.play(resource);
}
