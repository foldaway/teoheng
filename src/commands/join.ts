import GuildManager from '../GuildManager';

const Join: App.CommandHandler = async function (msg) {
  if (msg.guild == null) {
    return;
  }

  const senderVoiceChannel = msg.member?.voice?.channel;

  if (senderVoiceChannel == null) {
    msg.reply('You are not in a voice channel');
    return;
  }

  await senderVoiceChannel.join();

  msg.reply(`Joined ${senderVoiceChannel.name}`);

  GuildManager.init(senderVoiceChannel.guild.id);
};

export default Join;
