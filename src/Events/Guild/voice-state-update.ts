import playerUtilities from '../../Utilities/player-utilities.js';
import { Client, VoiceState } from 'discord.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
    if (!newState.channelId && newState.id == client.user?.id) {
      playerUtilities.destroy();
    }
  }
};
