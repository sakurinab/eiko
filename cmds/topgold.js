const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');

module.exports.run = async (bot,message,args) => {
    try{
        
        let rUser = message.author;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        const results = await profileModel.find({}).sort({goldCoins: -1}).limit(10);

        var lbString = "";
        var lbPos = 1;
        var lbEmoji = ""

        for (let i = 0; i < results.length; i++) {
            const { userID, goldCoins = 0 } = results[i];

            switch (lbPos) {
            case 1:
                lbEmoji = "🥇"
                break;
            case 2:
                lbEmoji = "🥈"
                break;
            case 3:
                lbEmoji = "🥉"
                break;
            default:
                lbEmoji = ""
                break;
            }
            if (lbPos <= 3) {
                lbString += lbEmoji + ` <@${userID}>\nБаланс: ` + goldCoins + ` ${config.goldCoin}\n\n`;
            } else {
                lbString += lbPos + ". " + ` <@${userID}>\nБаланс: ` + goldCoins + ` ${config.goldCoin}\n\n`;
            }
            lbPos++;
        }

        var lbEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Топ по золоту")
        .setDescription("```Топ 5 с наибольшим количеством золота:```\n" + lbString)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();
        message.channel.send(lbEmbed);

    } catch(err) {
        if(err.name === "ReferenceError")
        console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "topg",
    alias: "topgold"
};