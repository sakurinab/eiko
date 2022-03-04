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
		let uid = message.author.id;
		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		let rand = Math.floor(Math.random() * 101);
		if (message.member.roles.cache.has("851212588233785424")) {
			rand = Math.floor(Math.random() * 14) + 87;
		}

		let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Недостаточно монет.\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let sumErrEmbed = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли сделать ставку.\n\nПример команды:\n` + "`" + `.casino 100` + "`")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let casinoLoseEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Казино◞")
		.setDescription(`Выпало число ${rand}\n\n**Вы проиграли ${args[0]} ${config.silverCoin}**\n\nВаш баланс: ${userCoins - parseInt(args[0])} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		if(!args[0] || isNaN(args[0]) || (args[0] <= 0)) {
			message.channel.send(sumErrEmbed);
			return;
		} else if(userCoins < args[0]) {
			message.channel.send(errorCoins);
			return;
		} else {
			if(85 <= rand &&  rand <= 90) {
				//снять деньги с юзера
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпало число ${rand} и умножило Вашу ставку в **2 раза**\n\nВаш баланс: ${userCoins + parseInt(args[0])} ${config.silverCoin}`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0]))}});
				message.channel.send(casinoEmbed);
			} else if(99 >= rand && rand > 90) {
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпало число ${rand} и умножило Вашу ставку в **3 раза**\n\nВаш баланс: ${userCoins + parseInt(args[0])*2} ${config.silverCoin}`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0])*2)}});
				message.channel.send(casinoEmbed);
			} else if(rand > 99) {
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпало число ${rand} и умножило Вашу ставку в **6 раз**\n\nВаш баланс: ${userCoins + parseInt(args[0])*5} ${config.silverCoin}`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0])*5)}});
				message.channel.send(casinoEmbed);
			} else {
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: -(parseInt(args[0]))}});
				message.channel.send(casinoLoseEmbed);
			}
			if (args[0] >= 100000 && rand <= 85) {
				profileData = await profileModel.findOne({ userID: uid });
	            let achieve = profileData.achievements;

				const exclsName = `"Деньги на ветер"`;
				const exclsEmoji = "💸";

				let newExclsEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
				.setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				achieveNew = achieve.toString();
				if (achieveNew.indexOf(exclsEmoji) > -1) {
					return;
				} else {
					achieveNew = achieveNew + exclsEmoji + " ";
	                profileData = await profileModel.updateOne({
	                    userID: uid,
	                }, {
	                    achievements: achieveNew,
	                });
					let exclsGet = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
					.setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
					.setTimestamp();

					bot.users.cache.get(rUser.id).send(exclsGet);
					bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
				}
	        }

	        if (rand > 99) {
				profileData = await profileModel.findOne({ userID: uid });
	            let achieve = profileData.achievements;

				const exclsName = `"Большая удача"`;
				const exclsEmoji = "🍀";

				let newExclsEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
				.setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				achieveNew = achieve.toString();
				if (achieveNew.indexOf(exclsEmoji) > -1) {
					return;
				} else {
					achieveNew = achieveNew + exclsEmoji + " ";
	                profileData = await profileModel.updateOne({
	                    userID: uid,
	                }, {
	                    achievements: achieveNew,
	                });
					let exclsGet = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
					.setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
					.setTimestamp();

					bot.users.cache.get(rUser.id).send(exclsGet);
					bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
				}
	        }
		}
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "cc",
	alias: "casino"
};