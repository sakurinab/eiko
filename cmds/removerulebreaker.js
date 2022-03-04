const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const rbModel = require('../schemas/rbSchema.js');

module.exports.run = async (bot,message,args) => {
try{
	
	let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
	let rUser = message.author;
	let uid = mUser.id;

	let permErr = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`К сожалению, Вы не можете сделать это.`)
	.setTimestamp();

	let sameErr = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`К сожалению, Вы не можете выдать бан самому себе.`)
	.setTimestamp();

	let noUser = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Пользователь не найден.`)
	.setTimestamp();

	let notbanned = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Наказания◞")
	.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Данный пользователь не имеет наказания.`)
	.setTimestamp();
	
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	if (!mUser || mUser.id == config.botId) return message.channel.send(noUser);
	if (mUser.id === rUser.id) return message.channel.send(sameErr);
	if (!mUser.roles.cache.has(config.rbRole)) return message.channel.send(notbanned);

	rbData = await rbModel.findOne({
		userID: uid
	});
	if (rbData) {
		rb = await rbModel.updateOne({
			userID: uid,
		}, {
			timeout: 0,
		});
	}

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "unrb",
	alias: "unrulebreaker"
};