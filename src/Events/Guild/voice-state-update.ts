import { Client, VoiceState } from 'discord.js';
import playerUtilities from '../../Utilities/player-utilities.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
    if (!newState.channelId && newState.id == client.user?.id) {
      playerUtilities.destroy();
    }
  }
};
