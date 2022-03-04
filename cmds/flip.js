const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
module.exports.run = async (bot, message, args) => {
    try {
        
        let rUser = message.author;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        let rand = Math.floor(Math.random() * 2);

        if (rand == 0) {
            let tails = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Монетка◞")
                .setDescription(`Выпала решка!`)
                .setImage('https://media.discordapp.net/attachments/837916753346035752/837916800179765248/DeadrabbitCoinTails.png')
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            message.channel.send(tails)
        } else {
            let head = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Монетка◞")
                .setDescription(`Выпал орёл!`)
                .setImage('https://media.discordapp.net/attachments/837916753346035752/837916800179765248/DeadrabbitCoinTails.png')
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            message.channel.send(head)
        }

    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "flip"
};