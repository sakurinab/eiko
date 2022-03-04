const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
		let uid = message.author.id;

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		if (mUser) {
			profileDataMUser = await profileModel.findOne({ userID: mUser.id });
		}
		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

		let transferErrUser = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Пользователь не найден.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let transferErrNum = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`"${args[1]}" не является корректным числом`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let transferErrSame = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы не можете перевести деньги самому себе.`)
		.setTimestamp();

		let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Недостаточно монет.\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		if(!mUser || !profileDataMUser) return message.channel.send(transferErrUser);
		if(mUser.id == rUser.id) return message.channel.send(transferErrSame);
		if(!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(transferErrNum);
		if(userCoins < Math.abs(args[1])) return message.channel.send(errorCoins);

		profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            $inc: {
                silverCoins: -parseInt(args[1])
            }
        });
        profileDataMUser = await profileModel.updateOne({
            userID: mUser.id,
        }, {
            $inc: {
                silverCoins: parseInt(args[1])
            }
        });
		let transferEmbedDM = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Пользователь ${rUser} перевёл вам ${args[1]} ${config.silverCoin}`)
		.setTimestamp();
		bot.users.cache.get(mUser.id).send(transferEmbedDM);

		let transferEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Баланс◞")
		.setDescription(`Пользователю ${mUser} было переведено ${args[1]} ${config.silverCoin}`)
		.setTimestamp();
		message.channel.send(transferEmbed);
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "transfer"
};