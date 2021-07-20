const GuildMap = new Map<string, App.GuildSession>();

const GuildManager = {
  init(guildId: string) {
    const session: App.GuildSession = {
      queue: [],
    };

    GuildMap.set(guildId, session);

    return session;
  },

  getQueue(guildId: string) {
    const session = GuildMap.get(guildId);

    if (session == null) {
      throw new Error('no session for guild id');
    }

    return session.queue;
  },

  addToQueue(guildId: string, items: App.QueueItem[]) {
    const queue = this.getQueue(guildId);

    queue.push(...items);
  },
};

export default GuildManager;
