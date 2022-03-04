const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const actionModel = require('../schemas/actionSchema.js');
//множитель
const multi = 65;
module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        let inActionData = await actionModel.findOne({ userID: uid });
        let inAction = !inActionData ? (newInActionUser = await actionModel.create({ userID: uid, inAction: 0 }), newInActionUser.save(), 0) : (inActionData.inAction);

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userGoldCoins = profileData.goldCoins;

		let noSumErr = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`Укажите сумму.`)
		.setTimestamp();

		let errorGoldCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Недостаточно золота.\nВаш баланс: ${userGoldCoins} ${config.goldCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let canceled = new Discord.MessageEmbed()
        .setTitle(`⸝⸝ ♡₊˚ Валюта◞`)
        .setDescription(`Обмен был отменён.`)
        .setColor(config.defaultColor)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp();

        let cantOpenNewDialogue = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Сначала закройте Ваше последнее диалогове окно.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

		if (!args[0] || isNaN(args[0]) || (args[0] <= 0)) return message.channel.send(noSumErr);
		if (args[0] > userGoldCoins) return message.channel.send(errorGoldCoins);

        let success = new Discord.MessageEmbed()
        .setTitle(`⸝⸝ ♡₊˚ Валюта◞`)
        .setDescription(`Вы обменяли ${args[0]} ${config.goldCoin} на ${args[0]*multi} ${config.silverCoin}\n\nВаш баланс серебра: ${userCoins + args[0]*multi} ${config.silverCoin}\nВаш баланс золота: ${userGoldCoins - args[0]} ${config.goldCoin}`)
        .setColor(config.defaultColor)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp();

		let conf = new Discord.MessageEmbed()
        .setTitle(`⸝⸝ ♡₊˚ Валюта◞`)
        .setDescription(`${rUser} Вы уверены, что хотите обменять ${args[0]} ${config.goldCoin} на ${args[0]*multi} ${config.silverCoin}`)
        .setColor(config.defaultColor)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp();

        //не давать открыть диалоговое окно, если прошлое не закрыто
        if (inAction == 1) return message.channel.send(cantOpenNewDialogue);
        await actionModel.updateOne({ userID: uid }, { $set: {inAction: 1} });

		const msg = await message.channel.send(conf);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"),{max: 1, time:60000})
            .then(async collected => {
                if(collected.first().emoji.name == "✅"){
                	profileData = await profileModel.updateOne({
			            userID: uid,
			        }, {
                        $inc: {
                            silverCoins: parseInt(args[0] * multi),
                            goldCoins: -parseInt(args[0]),
                        }
			        });
			        msg.reactions.removeAll();
			        msg.edit(success);
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return;
                } else if(collected.first().emoji.name == "❌"){
                    msg.edit(canceled);
                    msg.reactions.removeAll();
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return;
                } else {
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return console.log("Ошибка реакции");
                }
            }).catch(async err => {
                msg.edit(canceled);
                console.log(err);
                msg.reactions.removeAll();
                await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                return;
            });
	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "convert",
	alias: "conv"
};