const { Telegraf } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);

const web_link = process.env.WEB_LINK;
const community_link = process.env.COMMUNITY_LINK; 

bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?ref=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to PlutoTap!*
Tap on the coin and see your balance rise.

*PlutoTap* is a Decentralized Exchange on the TON Blockchain. The biggest part of Plutotap Token PLUTO distribution will occur among the players here.

Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`, {
      reply_markup: {
          inline_keyboard: [
            [{ text: "👋 Start now!", web_app: { url: urlSent } }],
            [{ text: "Join Community", url: community_link }]
          
          ],
          in: true
      },
  });
});



bot.launch();
