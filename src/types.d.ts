declare namespace App {
  interface CommandHandler {
    (msg: import('discord.js').Message): Promise<void>;
  }

  interface YTSearchEntry {
    duration: number;
    _type?: 'url';
    ie_key?: 'Youtube';
    uploader: string;
    title: string;
    url: string;
    view_count: number;
    id: string;
  }

  interface YTSearchResponse {
    extractor: 'youtube:search';
    _type: 'playlist';
    extractor_key: 'YouTubeSearch';
    webpage_url: string;
    entries: YTSearchEntry[];
    id: string;
    webpage_url_basename: string;
    title?: string;
    uploader?: string;
  }

  type QueueItem = YTSearchEntry;

  interface GuildSession {
    currentItem: QueueItem | null;
    queue: QueueItem[];
    stream: import('discord.js').StreamDispatcher | null;
  }
}
