import { AudioResource } from '@discordjs/voice';

export interface Song {
  title: string;
  url: string;
  author: string;
  length: string;
  thumbnail: string;
  requestedBy: string;
}

export interface SongQueueEntry extends Song {
  resource: AudioResource;
}

export enum PlayerMode {
  Sleep = 0,
  TTS = 1,
  Music = 2
}
