import Vosk from 'vosk';
import voiceConnectionUtilities from './voice-connection-utilities.js';
import { EndBehaviorType } from '@discordjs/voice';
import * as prism from 'prism-media';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';

/* Experimental */

class VoiceRecognitionUtilities {
  async processAudio(stream: any) {}

  async listenToUser() {
    const listener = voiceConnectionUtilities.getConnection()?.receiver;

    listener?.speaking.on('start', (userId: string) => {
      const opusStream = listener?.subscribe(userId, { end: { behavior: EndBehaviorType.AfterSilence, duration: 1000 } });

      const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
          channelCount: 2,
          sampleRate: 48000
        }),
        pageSizeControl: {
          maxPackets: 10
        }
      });

      const filename = `./dist/Audio/${Date.now()}.ogg`;

      const out = createWriteStream(filename);

      console.log(`👂 Started recording ${filename}`);

      pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
          console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
          console.log(`✅ Recorded ${filename}`);
        }
      });
    });
  }
}

export default new VoiceRecognitionUtilities();
