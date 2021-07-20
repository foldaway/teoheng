const Leave: App.CommandHandler = async function (msg) {
  if (msg.guild == null) {
    return;
  }

  const senderVoiceChannel = msg.member?.voice?.channel;

  if (senderVoiceChannel == null) {
    msg.reply('You are not in a voice channel');
    return;
  }

  senderVoiceChannel.leave();

  msg.reply(`Left ${senderVoiceChannel.name}`);
};

export default Leave;
