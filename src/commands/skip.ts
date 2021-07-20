import GuildManager from '../GuildManager';

const Skip: App.CommandHandler = async function (msg) {
  if (msg.guild == null) {
    return;
  }

  const { stream } = GuildManager.getSession(msg.guild.id);

  if (stream == null) {
    msg.reply('nothing to skip');
    return;
  }

  stream.end();
};

export default Skip;
