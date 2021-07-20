import { Message } from 'discord.js';
import youtubeDlExec from 'youtube-dl-exec';

import GuildManager from '../GuildManager';
import Join from './join';

const { COMMAND_PREFIX = '/' } = process.env;

const ResultsCache = new Map<string, App.YTSearchEntry[]>();

async function processURL(url: URL, msg: Message) {
  const params = new URLSearchParams(url.search);

  if (url.pathname === '/watch' && params.has('v')) {
    // Single video

    const response = await youtubeDlExec(url.toString(), {
      dumpSingleJson: true,
      skipDownload: true,
      flatPlaylist: true,
    });

    GuildManager.addToQueue(msg.guild!.id, [response]);

    msg.reply(`queueing **${response.title}** | ${response.uploader}`);
  } else if (params.has('list')) {
    // Playlist
    const response = await youtubeDlExec(url.toString(), {
      dumpSingleJson: true,
      skipDownload: true,
      flatPlaylist: true,
    });

    const searchResponse = response as unknown as App.YTSearchResponse;

    GuildManager.addToQueue(msg.guild!.id, searchResponse.entries);

    msg.reply(
      `queueing ${searchResponse.entries.length} items from **'${searchResponse.title}'** | ${searchResponse.uploader}`
    );

    console.log(response);
  }
}

const Play: App.CommandHandler = async function (msg) {
  const term = msg.content.split(' ').slice(1).join(' ');

  if (msg.guild == null) {
    return;
  }

  const guildId = msg.guild.id;

  const senderVoiceChannel = msg.member?.voice?.channel;
  if (senderVoiceChannel == null) {
    await Join(msg);
  }

  try {
    const url = new URL(term);
    await processURL(url, msg);
    return;
  } catch (e) {}

  // Text search
  const response = await youtubeDlExec(`ytsearch8:${term}`, {
    dumpSingleJson: true,
    skipDownload: true,
    flatPlaylist: true,
  });

  const searchResponse = response as unknown as App.YTSearchResponse;

  ResultsCache.set(msg.author.id, searchResponse.entries);

  console.log(
    `[PLAY] Found ${searchResponse.entries.length} results for query '${term}'`
  );

  let content = 'here are your search results:\n\n';

  for (const [index, item] of searchResponse.entries.entries()) {
    content += `\`${index + 1}.\` **${item.title}** | ${item.uploader}\n`;
  }

  content +=
    '\nreply with a single number, no command needed. Anything else will cancel the search.';

  const resultsMsg = await msg.reply(content);

  const handler = (subMsg: Message) => {
    if (subMsg.author.id !== msg.author.id) {
      return;
    }

    resultsMsg.delete();
    subMsg.client.off('message', handler);

    if (subMsg.content.startsWith(COMMAND_PREFIX)) {
      // User ran another command, abort
      ResultsCache.delete(subMsg.author.id);
      return;
    }

    try {
      const choice = parseInt(subMsg.content, 10);
      const results = ResultsCache.get(subMsg.author.id) ?? [];

      const chosen = results[choice - 1];

      if (chosen == null) {
        throw Error();
      }

      GuildManager.addToQueue(guildId, [chosen]);

      subMsg.reply(`queueing **${chosen.title}** | ${chosen.uploader}`);
    } catch (e) {
      subMsg.reply('invalid choice');
    }

    ResultsCache.delete(subMsg.author.id);
  };

  msg.client.on('message', handler);
};

export default Play;
