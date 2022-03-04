const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
module.exports.run = async (bot,message,args) => {
  
  let rUser = message.author;
  
  if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
    bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
    message.delete();
    return;
  }

  let ticketname = "ticket-" + message.author.username + message.author.discriminator;

  let ticketCreateErrEmbed = new Discord.MessageEmbed()
  .setColor(`${config.errColor}`)
  .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
  .setDescription(`Упс... Кажется, что у Вас уже есть открытый тикет.`)
  .setTimestamp();

  if (message.guild.channels.cache.find(c => c.name.toLowerCase() === ticketname.toLowerCase())) {
    message.reply(ticketCreateErrEmbed);
    return;
  }

  const channel = await message.guild.channels.create(`ticket-${message.author.tag}`);

  let ticketMsgEmbed = new Discord.MessageEmbed()
  .setColor(`${config.defaultColor}`)
  .setTitle("⸝⸝ ♡₊˚ Тикет◞")
  .setDescription(`Спасибо за Ваше обращение. Задайте свой вопрос или оставьте отзыв здесь.\nАдминистрация ответит Вам как можно быстрее!`)
  .setTimestamp();

  let ticketRemoveMsgEmbed = new Discord.MessageEmbed()
  .setColor(`${config.defaultColor}`)
  .setTitle("⸝⸝ ♡₊˚ Тикет◞")
  .setDescription(`Данный тикет будет удалён через 5 секунд.`)
  .setTimestamp();

  let ticketCloseMsgEmbed = new Discord.MessageEmbed()
  .setColor(`${config.defaultColor}`)
  .setTitle("⸝⸝ ♡₊˚ Тикет◞")
  .setDescription(`Данный тикет был закрыт.`)
  .setTimestamp();

  let ticketCreateMsgEmbed = new Discord.MessageEmbed()
  .setColor(`${config.defaultColor}`)
  .setTitle("⸝⸝ ♡₊˚ Тикет◞")
  .setDescription(`Спасибо за Ваше обращение. Задайте свой вопрос или оставьте отзыв здесь ${channel}.\nАдминистрация ответит Вам как можно быстрее!`)
  .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
  .setTimestamp();

  channel.setParent(config.ticketCategory);

  channel.updateOverwrite(message.guild.id, {
    SEND_MESSAGE: false,
    VIEW_CHANNEL: false,
  });
  channel.updateOverwrite(message.author, {
    SEND_MESSAGE: true,
    VIEW_CHANNEL: true,
  });

  const reactionMessage = await channel.send(ticketMsgEmbed);

  try {
    await reactionMessage.react("🔒");
    await reactionMessage.react("⛔");
  } catch (err) {
    channel.send("Ошибка отправки эмоджи.");
    throw err;
  }

  const collector = reactionMessage.createReactionCollector(
    (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
    { dispose: true }
  );

  collector.on("collect", (reaction, user) => {
    switch (reaction.emoji.name) {
      case "🔒":
        channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
        channel.send(ticketCloseMsgEmbed);
        break;
      case "⛔":
        channel.send(ticketRemoveMsgEmbed);
        setTimeout(() => channel.delete(), 5000);
        break;
    }
  });

  message.channel
  .send(ticketCreateMsgEmbed)
  .catch((err) => {
    throw err;
  });
};

module.exports.help = {
  name: "ticket"
};
