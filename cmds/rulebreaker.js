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
	.setDescription(`К сожалению, Вы не можете выдать наказание самому себе.`)
	.setTimestamp();

	let noUser = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Пользователь не найден.`)
	.setTimestamp();

	let noTime = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Время наказания не указано!`)
	.setTimestamp();

	let userIsHigher = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему наказание.`)
	.setTimestamp();
	
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	if (!mUser || mUser.id == config.botId) return message.channel.send(noUser);
	let uid = mUser.id;
	if (mUser.id === rUser.id) return message.channel.send(sameErr);
	if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
	let reason = args.slice(2).join(' ');
	if (reason.length < 1) reason = 'Причина не указана.';
	if (!args[1] || isNaN(ms(args[1]))) return message.channel.send(noTime);

	let banTime = ms(args[1]);

	rbData = await rbModel.findOne({
		userID: uid
	});
	if (!rbData) {
		rb = await rbModel.create({
			userID: uid,
			timeout: banTime,
			reason: reason,
			rbGet: Date.now(),
		});
		//сохранение документа
		rb.save();
	} else {
		rbData = await rbModel.updateOne({
        	userID: uid,
	    }, {
	    	timeout: banTime,
			reason: reason,
			rbGet: Date.now(),
	    });
	}

	mUser.roles.add(config.rbRole);

	const seconds = Math.floor((banTime / 1000) % 60);
	const minutes = Math.floor((banTime / 1000 / 60) % 60);
	const hours = Math.floor((banTime / 1000 / 60 / 60) % 24);
	const days = Math.floor(banTime / 1000 / 60 / 60 / 24);

	let rbEmd = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Наказания◞")
	.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`${mUser} получил наказание на: **${days}д. ${hours}ч. ${minutes}м. ${seconds}с.**\n\n**Причина: **` + "`" + reason + "`")
	.setTimestamp();

	if (mUser.voice.channel != null) {
		mUser.voice.setChannel(null);
	}

	message.channel.send(rbEmd);

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "rb",
	alias: "rulebreaker"
};