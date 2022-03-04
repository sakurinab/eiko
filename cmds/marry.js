const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const actionModel = require('../schemas/actionSchema.js');
//цены
marriageCost = 2000;

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
		let uid = message.author.id;
		let rMember = message.member;

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userGoldCoins = profileData.goldCoins;
        let userMarriage = profileData.marriage;

        let inActionData = await actionModel.findOne({ userID: uid });
		let inAction = !inActionData ? (newInActionUser = await actionModel.create({ userID: uid, inAction: 0 }), newInActionUser.save(), 0) : (inActionData.inAction);

        let cantOpenNewDialogue = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Сначала закройте Ваше последнее диалогове окно.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let youAlreadyMarried = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`Вы уже состоите в браке.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let noUser = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`Пользователь не найден.`)
		.setTimestamp();

		let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Недостаточно серебра. Стоимость брака: ${marriageCost} ${config.silverCoin}\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

        if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) return message.channel.send(youAlreadyMarried);
        if (!mUser || mUser.id == config.botId || mUser.id == uid) return message.channel.send(noUser);

        let userAlreadyMarried = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`К сожалению, ${mUser} уже состоит в браке.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let marryConf = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`${mUser}, пользователь ${rUser} предлагает Вам заключить брак. Что Вы ему ответите?`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let success = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`${mUser} и ${rUser} теперь состоят в браке!`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let cancel = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`${rUser}, к сожалению, Вам отказали.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let ignore = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Браки◞")
		.setDescription(`${rUser}, к сожалению, вас проигнорировали.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

        profileDataMUser = await profileModel.findOne({ userID: uid });
        let mUserMarriage = profileDataMUser.marriage;
        if (!(mUserMarriage == "" || mUserMarriage == " " || mUserMarriage == null || mUserMarriage == "Нет")) return message.channel.send(userAlreadyMarried);

        if (userCoins < marriageCost) return message.channel.send(errorCoins);

        //не давать открыть диалоговое окно, если прошлое не закрыто
		if (inAction == 1) return message.channel.send(cantOpenNewDialogue);
		await actionModel.updateOne({ userID: uid }, { $set: {inAction: 1} });

		const msg = await message.channel.send(marryConf);
        await msg.react("✅");
        await msg.react("❌");
        await msg.awaitReactions((reaction, user) => user.id == mUser.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"),{max: 1, time:60000})
        .then(async collected => {
            if(collected.first().emoji.name == "✅"){
                msg.reactions.removeAll();

                profileDataMUser = await profileModel.findOne({ userID: uid });
		        let mUserMarriage = profileDataMUser.marriage;
		        if (!(mUserMarriage == "" || mUserMarriage == " " || mUserMarriage == null || mUserMarriage == "Нет")) {
		        	await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
		        	return msg.edit(userAlreadyMarried);
		        }

                profileData = await profileModel.findOne({ userID: uid });
   				userCoins = profileData.silverCoins;
   				let errorCoins = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Недостаточно серебра. Стоимость брака: ${marriageCost} ${config.silverCoin}\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
                if (userCoins < marriageCost) {
                	await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                	return msg.edit(errorCoins);
                }

                profileData = await profileModel.updateOne({
		            userID: uid,
		        }, {
		            marriage: mUser.id,
		            $inc: {
                    	silverCoins: -marriageCost
                	}
		        });

				profileData = await profileModel.updateOne({
		            userID: mUser.id,
		        }, {
		            marriage: uid
		        });

		        rMember.roles.add(config.inLoveRole);
		        mUser.roles.add(config.inLoveRole);

			    msg.edit(success);
			    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                return;
            } else if(collected.first().emoji.name == "❌"){
                msg.edit(cancel);
                msg.reactions.removeAll();
                await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                return;
            } else {
            	await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                return console.log("Ошибка реакции");
            }
        }).catch(async err => {
            msg.edit(ignore);
            console.log("It's fine... " + err);
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
	name: "marry"
};