const Discord = require('discord.js');
const fs = require('fs');
let config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const pvcModel = require('../schemas/pvcSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		if(!message.channel.id == '909558438844047421') return
		let rUser = message.author;
		let uid = message.author.id;

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		pvcData = await pvcModel.findOne({ userID: uid });
        let userOwnVC = pvcData.ownvc;

		const allCommands = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Команды приватных комнат◞")
		.setDescription(`**.vc lock** - закрыть комнату;\n**.vc unlock** - открыть комнату;\n**.vc name <имя комнаты>** - установить имя комнаты;\n**.vc limit <0-99>** - установить лимит участников в комнате;\n**.vc invite <@пользователь>** - пригласить пользователя в комнату;\n**.vc kick <@пользователь>** - кикнуть пользователя из комнаты;\n**.vc ban <@пользователь>** - забанить пользователя в комнате.\n**.vc unban <@пользователь>** - разбанить пользователя в комнате.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();
		if(message.member.voice.channel != null) {
			if(message.member.voice.channel.id == userOwnVC) {
				if (args[0] == "limit") {
					if (!args[1] || isNaN(args[1]) || (Math.abs(args[1]) > 99)) {
						let vcLimitError = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`${args[1]} не является верным числом.\n\nПример команды:\n` + "`" + `.vc limit 10` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcLimitError);
					} else {
						message.member.voice.channel.setUserLimit(Math.abs(args[1]));
						let vcLimit = new Discord.MessageEmbed()
						.setColor(`${config.defaultColor}`)
						.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
						.setDescription(`В комнате установлен лимит в ${Math.abs(args[1])} участников.`)
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcLimit);
					}
				} else if (args[0] == "name") {
					if (!args[1] || message.content.slice(8).length > 100) {
						let vcNameError = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`Укажите имя комнаты.\n\nПример команды:\n` + "`" + `.vc name Слушаем музыку` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcNameError);
					} else {
						message.member.voice.channel.setName(message.content.slice(8));
						let vcName = new Discord.MessageEmbed()
						.setColor(`${config.defaultColor}`)
						.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
						.setDescription(`Имя комнаты теперь: ${message.content.slice(8)}`)
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcName);
					}
				} else if (args[0] == "lock") {
					message.member.voice.channel.updateOverwrite(config.everyoneID, { CONNECT: false, SPEAK: false});

					let vcLock = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
					.setDescription(`Ваша комната закрыта.`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
					message.channel.send(vcLock);
				} else if (args[0] == "unlock") {
					message.member.voice.channel.updateOverwrite(config.everyoneID, { CONNECT: true, SPEAK: true});

					let vcUnlock = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
					.setDescription(`Ваша комната открыта.`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
					message.channel.send(vcUnlock);
				} else if (args[0] == "invite") {
					let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));
					if (!mUser) {
						let vcInviteError = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`Такого пользователя нет!\n\nПример команды:\n` + "`" + `.vc invite ${rUser}` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcInviteError);
					} else {
						message.member.voice.channel.updateOverwrite(mUser.id, { CONNECT: true, SPEAK: true});

						let vcInvite = new Discord.MessageEmbed()
						.setColor(`${config.defaultColor}`)
						.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
						.setDescription(`<@${mUser.id}> был приглашён в Вашу комнату.`)
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcInvite);
					}
				} else if (args[0] == "kick") {
					let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));
					if (!mUser) {
						let vcKickErr = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`Вы не указали пользователя!\n\nПример команды:\n` + "`" + `.vc kick ${rUser}` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcKickErr);
					} else {
						if(mUser.voice.channel != null) {
							if(mUser.voice.channel.id == userOwnVC) {
								mUser.voice.setChannel(null);

								let vcKick = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
								.setDescription(`<@${mUser.id}> был кикнут из Вашей комнаты!`)
								.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
								.setTimestamp();
								message.channel.send(vcKick);
							} else {
								let vcUserKickErr = new Discord.MessageEmbed()
								.setColor(`${config.errColor}`)
								.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
								.setDescription(`Пользователя нет в Вашей комнате!`)
								.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
								.setTimestamp();
								message.channel.send(vcUserKickErr);
							}
						} else {
							let vcUserKickErr = new Discord.MessageEmbed()
							.setColor(`${config.errColor}`)
							.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
							.setDescription(`Пользователя нет в Вашей комнате!`)
							.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();
							message.channel.send(vcUserKickErr);
						}
					}
				} else if (args[0] == "ban") {
					let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));
					if (!mUser) {
						let vcBanErr = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`Вы не указали пользователя!\n\nПример команды:\n` + "`" + `.vc ban ${rUser}` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcBanErr);
					} else {
						message.member.voice.channel.updateOverwrite(mUser.id, { CONNECT: false, SPEAK: false});

						mUser.voice.setChannel(null);

						let vcBan = new Discord.MessageEmbed()
						.setColor(`${config.defaultColor}`)
						.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
						.setDescription(`<@${mUser.id}> был забанен в Вашей комнате!`)
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcBan);
					}
				} else if(args[0] == "unban") {
					let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));
					if (!mUser) {
						let vcUnbanErr = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
						.setDescription(`Вы не указали пользователя!\n\nПример команды:\n` + "`" + `.vc unban ${rUser}` + "`")
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcUnbanErr);
					} else {
						message.member.voice.channel.permissionOverwrites.get(mUser.id).delete();

						mUser.voice.setChannel(null);

						let vcUnban = new Discord.MessageEmbed()
						.setColor(`${config.defaultColor}`)
						.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
						.setDescription(`<@${mUser.id}> был разбанен в Вашей комнате!`)
						.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();
						message.channel.send(vcUnban);
					}
				} else {
					message.channel.send(allCommands);
				}
			} else {
				let errorVc = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Вы не являетесь владельцем данного голосового канала.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
				message.channel.send(errorVc);
			}
		} else {
			message.channel.send(allCommands);
		}
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "vc",
	alias: "pr"
};