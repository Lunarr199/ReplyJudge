const { Client, Events, GatewayIntentBits } = require("discord.js");
const TOKEN = require("./config.json").token; // create a file to store your bot (app) token (create it yourself dummy)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.reference) return;

  try {
    const referenced = await message.fetchReference();
    const r_author = referenced.author;
    const mentioned = message.mentions.users;

    if (!mentioned.has(r_author.id)) {
      // totally fair judgement
      let witnesses = [];

      try {
        const messages = (
          await message.channel.messages.fetch({ limit: 5 }) // the 5 most recent messages
        ).filter((msg) => !msg.author.bot);

        messages.forEach((msg) => witnesses.push(msg.author));
      } catch (err) {
        console.log(`Failed to fetch messages: `, err);
      }

      const mentions = witnesses.map((person) => person.toString()).join(" ");

      message.reply({
        content: `${mentions} this guy ${message.author} doesn't turn on reply ping!!!!!!!`, // change this to your own message
      });
    }
  } catch (err) {
    console.warn(`Failed to fetch referenced message: `, err);
  }
});

client.once(Events.ClientReady, (readyclient) => {
  console.log(`Ready! Logged in as ${readyclient.user.tag}`);
});

client.login(TOKEN);
