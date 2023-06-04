export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready, client is now logged as ${client.user?.username}!`);
    }
};
