const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		
		let mUser = message.guild.member(message.guild.members.cache.get(args[1]) || message.mentions.users.first());
		let rUser = message.author;
		let uid = message.author.id;

		let permErr = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`К сожалению, Вы не можете сделать это.`)
		.setTimestamp();

		let userErr = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`К сожалению, Вы не можете выдать деньги данному пользователю.`)
		.setTimestamp();

		let noUserErr = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`Такого пользователя нет.`)
		.setTimestamp();

		let noSumErr = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`Укажите сумму.`)
		.setTimestamp();

		if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(permErr);
		profileDataMUser = await profileModel.findOne({ userID: mUser.id });
        let mUserCoins = profileDataMUser.silverCoins;
        let mUserGoldCoins = profileDataMUser.goldCoins;

        let giveSilverEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Пользователю ${mUser} было выдано ${args[2]} ${config.silverCoin}\n\nЕго баланс: ${mUserCoins + parseInt(args[2])} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let giveGoldEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Пользователю ${mUser} было выдано ${args[2]} ${config.goldCoin}\n\nЕго баланс: ${mUserGoldCoins + parseInt(args[2])} ${config.goldCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let takeSilverEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`С пользователя ${mUser} было списано ${args[2]} ${config.silverCoin}\n\nЕго баланс: ${mUserCoins - parseInt(args[2])} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let takeGoldEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`С пользователя ${mUser} было списано ${args[2]} ${config.goldCoin}\n\nЕго баланс: ${mUserGoldCoins - parseInt(args[2])} ${config.goldCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let dmgiveSilverEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Вам было выдано ${args[2]} ${config.silverCoin}\n\nВаш баланс: ${mUserCoins + parseInt(args[2])} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let dmgiveGoldEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Вам было выдано ${args[2]} ${config.goldCoin}\n\nВаш баланс: ${mUserGoldCoins + parseInt(args[2])} ${config.goldCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let dmtakeSilverEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`С Вас было списано ${args[2]} ${config.silverCoin}\n\nВаш баланс: ${mUserCoins - parseInt(args[2])} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let dmtakeGoldEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`С Вас было списано ${args[2]} ${config.goldCoin}\n\nВаш баланс: ${mUserGoldCoins - parseInt(args[2])} ${config.goldCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		if(!profileDataMUser) return message.channel.send(userErr);
		if(!mUser) return message.channel.send(noUserErr);
		if(!args[2] || isNaN(args[2]) || (args[2] <= 0)) return message.channel.send(noSumErr);

		if(args[0] == "give") {
			profileDataMUser = await profileModel.updateOne({
                userID: mUser.id,
            }, {
            	$inc: {
                    silverCoins: parseInt(args[2])
                }
            });
			message.channel.send(giveSilverEmbed);
			bot.users.cache.get(mUser.id).send(dmgiveSilverEmbed);
		} else if(args[0] == "take") {
			profileDataMUser = await profileModel.updateOne({
                userID: mUser.id,
            }, {
                $inc: {
                    silverCoins: -parseInt(args[2])
                }
            });
			message.channel.send(takeSilverEmbed);
			bot.users.cache.get(mUser.id).send(dmtakeSilverEmbed);
		} else if(args[0] == "givegold") {
			profileDataMUser = await profileModel.updateOne({
                userID: mUser.id,
            }, {
                $inc: {
                    goldCoins: parseInt(args[2])
                }
            });
			message.channel.send(giveGoldEmbed);
			bot.users.cache.get(mUser.id).send(dmgiveGoldEmbed);
		} else if(args[0] == "takegold") {
			profileDataMUser = await profileModel.updateOne({
                userID: mUser.id,
            }, {
                $inc: {
                    goldCoins: -parseInt(args[2])
                }
            });
			message.channel.send(takeGoldEmbed);
			bot.users.cache.get(mUser.id).send(dmtakeGoldEmbed);
		}
	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "money",
	alias: "bal"
};