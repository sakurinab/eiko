const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const rbModel = require('../schemas/rbSchema.js');

module.exports.run = async (bot,message,args) => {
try{
	
	let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
	let rUser = message.author;
	let author = message.guild.members.cache.get(rUser.id);

	let permErr = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`К сожалению, Вы не можете сделать это.`)
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

	if (!mUser || !message.member.hasPermission("MANAGE_MESSAGES")) {
		if (author.roles.cache.has(config.rbRole)) {
			rbData = await rbModel.findOne({
				userID: rUser.id
			});
			if (rbData) {
				let reason = rbData.reason;
				let banTime = rbData.timeout;
				let banGet = rbData.rbGet;
				let banTimeLeft = (banGet + banTime) - Date.now();
				const seconds = Math.floor((banTimeLeft / 1000) % 60);
				const minutes = Math.floor((banTimeLeft / 1000 / 60) % 60);
				const hours = Math.floor((banTimeLeft / 1000 / 60 / 60) % 24);
				const days = Math.floor(banTimeLeft / 1000 / 60 / 60 / 24);

				let rbEmd = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Наказания◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setDescription(`${rUser} до конца наказания: **${days}д. ${hours}ч. ${minutes}м. ${seconds}с.**\n\n**Причина: **` + "`" + reason + "`")
				.setTimestamp();

				message.channel.send(rbEmd);
			}
		} else {
			message.channel.send(notbanned);
		}
		return;
	}

	let uid = mUser.id;
	if (mUser.id == config.botId) return message.channel.send(noUser);

	if (message.member.hasPermission("MANAGE_MESSAGES")) {
		if (mUser.roles.cache.has(config.rbRole)) {
			rbData = await rbModel.findOne({
				userID: uid
			});
			if (rbData) {
				let reason = rbData.reason;
				let banTime = rbData.timeout;
				let banGet = rbData.rbGet;
				let banTimeLeft = (banGet + banTime) - Date.now();
				const seconds = Math.floor((banTimeLeft / 1000) % 60);
				const minutes = Math.floor((banTimeLeft / 1000 / 60) % 60);
				const hours = Math.floor((banTimeLeft / 1000 / 60 / 60) % 24);
				const days = Math.floor(banTimeLeft / 1000 / 60 / 60 / 24);

				let rbEmd = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Наказания◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setDescription(`${mUser} до конца наказания: **${days}д. ${hours}ч. ${minutes}м. ${seconds}с.**\n\n**Причина: **` + "`" + reason + "`")
				.setTimestamp();

				message.channel.send(rbEmd);
			}
		} else {
			message.channel.send(notbanned);
		}
	}
	

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "rbu",
	alias: "rbinfo"
};