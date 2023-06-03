import fs from 'fs';

async function loadEvents(client: any) {
  const folders = fs.readdirSync('./dist/src/Events');
  for (const folder of folders) {
    const files = fs.readdirSync(`./dist/src/Events/${folder}`).filter((file) => file.endsWith('js'));
    for (const file of files) {
      const event = await import(`../Events/${folder}/${file}`);

      if (event.default.rest) {
        if (event.default.once) {
          client.rest.once(event.default.name, (...args: any[]) => {
            event.default.execute(...args, client);
          });
        } else {
          client.rest.on(event.default.name, (...args: any[]) => {
            event.default.execute(...args, client);
          });
        }
      } else {
        if (event.default.once) {
          client.once(event.default.name, (...args: any[]) => {
            event.default.execute(...args, client);
          });
        } else {
          client.on(event.default.name, (...args: any[]) => {
            event.default.execute(...args, client);
          });
        }
      }
      continue;
    }
  }
}

export default loadEvents;
