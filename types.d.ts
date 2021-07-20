declare namespace App {
  interface CommandHandler {
    (msg: import('discord.js').Message): Promise<void>;
  }
}
