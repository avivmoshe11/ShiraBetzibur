import { AudioResource } from '@discordjs/voice';

export interface Song {
  title: string;
  url: string;
  author: string;
  length: string;
  thumbnail: string;
  requestedBy: string;
}

export interface QueueEntry extends Song {
  resource: AudioResource;
}
