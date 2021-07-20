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

  const { currentItem, queue } = GuildManager.getSession(msg.guild.id);

  let content = '';

  if (currentItem != null) {
    content += `Currently playing: **${currentItem.title}** | ${currentItem.uploader}\n\n`;
  } else {
    content += 'Currently playing: N/A\n\n';
  }

  if (queue.length === 0) {
    content += 'queue is empty';
  } else {
    content = `(${queue.length}) items in queue:\n\n`;

    for (const item of queue) {
      content += `**${item.title}** | ${item.uploader}\n`;
    }
  }

  const reply = await msg.reply(content);

  setTimeout(() => {
    reply.delete();
  }, 15 * 1000);
};

export default Queue;
