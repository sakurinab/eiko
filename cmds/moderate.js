const Discord = require('discord.js');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
//IDs
const stafRole = "831929714792726558";

module.exports.run = async (bot,message,args) => {
try{
	
	let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
	let rUser = message.author;

	// let userIsHigher = new Discord.MessageEmbed()
	// .setColor(`${config.errColor}`)
	// .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	// .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	// .setDescription(`Данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему наказание.`)
	// .setTimestamp();

	let stafMembers = bot.guilds.cache.get(config.serverId).roles.cache.get(stafRole).members.map(m => m.user.id);

	if (args[0] == "list") {
		let membersInfo = ``;

		stafMembers.forEach(id => {
			let roleStatus = message.guild.members.fetch(id).member.roles.highest.id;
			membersInfo += `• Пользователь: <@${id}> - Роль: ${roleStatus}\n`
		})

		let allStafList = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Отчёт по персоналу сервера◞")
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setDescription(membersInfo)
			.setTimestamp();

		message.channel.send(allStafList);

		return;
	}
	
	// if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	// if ()
	// let uid = mUser.id;
	// if (mUser.id === rUser.id) return message.channel.send(sameErr);
	// if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
	
	// const seconds = Math.floor((banTime / 1000) % 60);
	// const minutes = Math.floor((banTime / 1000 / 60) % 60);
	// const hours = Math.floor((banTime / 1000 / 60 / 60) % 24);
	// const days = Math.floor(banTime / 1000 / 60 / 60 / 24);

	//.setColor(`${config.defaultColor}`)
	//.setDescription(`${mUser} получил наказание на: **${days}д. ${hours}ч. ${minutes}м. ${seconds}с.**\n\n**Причина: **` + "`" + reason + "`")

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "moderate",
	alias: "mod"
};