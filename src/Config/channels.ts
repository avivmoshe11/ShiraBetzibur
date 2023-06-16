import client from '../../index.js';

export default {
  references: client.guilds.cache.first()?.channels.cache,
  log: {
    name: 'log',
    type: 'text',
    id: '1114645831983845408'
  },
  test: {
    name: 'testim',
    type: 'text',
    id: '1114968452608823296'
  },
  general: {
    name: 'הבית של סבתא',
    type: 'voice',
    id: '1114521726332706881'
  }
};
