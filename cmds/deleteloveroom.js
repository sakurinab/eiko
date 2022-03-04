const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const loveroomModel = require('../schemas/loveroomSchema.js');

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;
		let rMember = message.member;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userMarriage = profileData.marriage;

		let noLR = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`У Вас нет любовной комнаты.`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let deleted = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`Комната была удалена!`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let cancel = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`Удаление любовной комнаты было отменено.`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let deleteConf = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`Вы уверены, что хотите удалить любовную комнату?`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let loveroomId = 0;
		clrData = await loveroomModel.findOne({ userID: uid });
		if (!clrData) {
			clr = await loveroomModel.create({
				userID: uid,
				loveroomID: 0,
				loveroomTimestamp: 0,
				loveroomLastpayment: 0,
			});
			//сохранение документа
			clr.save();
		} else {
			loveroomId = clrData.loveroomID;
		}

		if (loveroomId == 0) return message.channel.send(noLR);

		const msg = await message.channel.send(deleteConf);
        await msg.react("✅");
        await msg.react("❌");
        await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"),{max: 1, time:60000})
        .then(async collected => {
            if(collected.first().emoji.name == "✅"){
                msg.reactions.removeAll();

                let mUser = bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage);

				clrResponce = await loveroomModel.updateOne({
					userID: uid,
				}, {
					loveroomID: 0,
					loveroomTimestamp: 0,
					loveroomLastpayment: 0,
				});

				clrResponce = await loveroomModel.updateOne({
					userID: mUser.id,
				}, {
					loveroomID: 0,
					loveroomTimestamp: 0,
					loveroomLastpayment: 0,
				});

				bot.channels.cache.find(ch => ch.id == loveroomId).delete();

				msg.edit(deleted);

                return;
            } else if(collected.first().emoji.name == "❌"){
                msg.edit(cancel);
                msg.reactions.removeAll();
                return;
            } else {
                return console.log("Ошибка реакции");
            }
        }).catch(async err => {
            msg.edit(cancel);
            console.log("It's fine... " + err);
            msg.reactions.removeAll();
            return;
        });

	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "deleteloveroom",
	alias: "dlr"
};