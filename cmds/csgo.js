const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//channels
const csgoChannels = [
		`851592064004390962`, //team A
		`851592097215283250`, //team B
		`851592003476389929` //main room
	]

module.exports.run = async (bot, message, args) => {
	try {
		let rUser = message.author;
		let mUser = message.guild.member(message.guild.members.cache.get(args[5]) || message.mentions.users.first());

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
			bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
			message.delete();
			return;
		}

		let noPerms = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`К сожалению, вы не можете сделать это.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();
		if (!message.member.roles.cache.has(config.csgoEventerRole) && !message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPerms)

		let noEventName = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы забыли указать название ивента.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		if (args[0] == "open") {
			let openEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ CS:GO◞`)
				.setDescription(`Комнаты были **открыты** для участников.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			csgoChannels.forEach(channelID => {
				bot.channels.cache.find(ch => ch.id == channelID).updateOverwrite(config.everyoneID, { CONNECT: true, SPEAK: true, VIEW_CHANNEL: true})
			})

			message.channel.send(openEmbed);

		} else if (args[0] == "close") {
			let closeEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ CS:GO◞`)
				.setDescription(`Комнаты были **закрыты** для участников.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			csgoChannels.forEach(channelID => {
				bot.channels.cache.find(ch => ch.id == channelID).updateOverwrite(config.everyoneID, { CONNECT: false, SPEAK: false, VIEW_CHANNEL: false})
			})

			message.channel.send(closeEmbed);
		} else {
			let helpEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ CS:GO◞`)
				.setDescription(`**.csgo open** - открыть комнаты для участников;\n**.csgo close** - закрыть комнаты для участников;\n**.csgo help** - данное сообщение.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(helpEmbed);
		}

	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "csgo"
};