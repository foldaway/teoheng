import GuildManager from '../GuildManager';

const Queue: App.CommandHandler = async function (msg) {
  if (msg.guild == null) {
    return;
  }

  const senderVoiceChannel = msg.member?.voice?.channel;

  if (senderVoiceChannel == null) {
    msg.reply('You are not in a voice channel');
    return;
  }

  const queue = GuildManager.getQueue(msg.guild.id);

  if (queue.length === 0) {
    const reply = await msg.reply('queue is empty');

    setTimeout(() => {
      reply.delete();
    }, 15 * 1000);
    return;
  }

  let content = `(${queue.length}) items in queue:\n\n`;

  for (const item of queue) {
    content += `**${item.title}** | ${item.uploader}\n`;
  }

  const reply = await msg.reply(content);

  setTimeout(() => {
    reply.delete();
  }, 15 * 1000);
};

export default Queue;
