const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
const pagination = require('discord.js-pagination');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const invModel = require('../schemas/inventorySchema.js');

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
        let uid = message.author.id;
        let member = message.member;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        profileData = await profileModel.findOne({ userID: uid });
        let userPBanner = profileData.profileBanner;
        let userPLine = profileData.profileLine;

        invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
			});
			//сохранение документа
			inv.save();
		}

		let cmdError = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Неизвестная команда.\n\nПример:\n` + '`' + `.inv roles` + '`\n' + '`' + `.inv emoji` + '`')
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

        //.buy role <index>
        //.buy emoji <index>
        if (args[0] == "roles" || args[0] == "role") {
        	invData = await invModel.findOne({ userID: uid });
			userRoles = invData.invRoles.sort((a, b) => (a.index > b.index) ? 1 : -1);

			let pages = [];

			if (userRoles.length <= 0) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setDescription(`Тут пока ничего нет w(o.o)w\n...`)
				.setImage(userPBanner)
				.setTimestamp();

				pages = [invEmbedPage1];
			} else if (userRoles.length <= 8) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 0; i < userRoles.length; i++) {
					invEmbedPage1.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage1.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage1.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage1.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				pages = [invEmbedPage1];
			} else if (userRoles.length > 8 || userRoles.length <= 16) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 0; i < 8; i++) {
					invEmbedPage1.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage1.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage1.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage1.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				var invEmbedPage2 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 8; i < userRoles.length; i++) {
					invEmbedPage2.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage2.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage2.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage2.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				pages = [invEmbedPage1, invEmbedPage2];
			} else if (userRoles.length > 8 || userRoles.length <= 16) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 0; i < 8; i++) {
					invEmbedPage1.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage1.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage1.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage1.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				var invEmbedPage2 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 8; i < 16; i++) {
					invEmbedPage2.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage2.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage2.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage2.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				var invEmbedPage3 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 16; i < userRoles.length; i++) {
					invEmbedPage3.addField(`Индекс`, "`" + `${userRoles[i].index}` + "`", inline = true);
					invEmbedPage3.addField(`Роль`, `<@&${userRoles[i].id}>`, inline = true);
					if (userRoles[i].type == "gold") {
						invEmbedPage3.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage3.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				pages = [invEmbedPage1, invEmbedPage2, invEmbedPage3];
			}

			
			const emoji = ["⏪", "⏩"];
			const timeout = '45000';
			pagination(message, pages, emoji, timeout);
        } else if (args[0] == "emoji" || args[0] == "emojis") {
        	invData = await invModel.findOne({ userID: uid });
			userEmoji = invData.invEmoji.sort((a, b) => (a.index > b.index) ? 1 : -1);

			let pages = [];

			if (userEmoji.length <= 0) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setDescription(`Тут пока ничего нет w(o.o)w\n...`)
				.setImage(userPBanner)
				.setTimestamp();

				pages = [invEmbedPage1];
			} else if (userEmoji.length <= 8) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 0; i < userEmoji.length; i++) {
					invEmbedPage1.addField(`Индекс`, "`" + `${userEmoji[i].index}` + "`", inline = true);
					invEmbedPage1.addField(`Пак: ${userEmoji[i].name}`, `${userEmoji[i].emojis}`, inline = true);
					if (userEmoji[i].type == "gold") {
						invEmbedPage1.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage1.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				pages = [invEmbedPage1];
			} else if (userEmoji.length > 8 || userEmoji.length <= 16) {
				var invEmbedPage1 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 0; i < 8; i++) {
					invEmbedPage1.addField(`Индекс`, "`" + `${userEmoji[i].index}` + "`", inline = true);
					invEmbedPage1.addField(`Пак: ${userEmoji[i].name}`, `${userEmoji[i].emojis}`, inline = true);
					if (userEmoji[i].type == "gold") {
						invEmbedPage1.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage1.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				var invEmbedPage2 = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
				.setFooter(`${rUser.tag}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setImage(userPBanner)
				.setTimestamp();

				for (let i = 8; i < 9; i++) {
					invEmbedPage2.addField(`Индекс`, "`" + `${userEmoji[i].index}` + "`", inline = true);
					invEmbedPage2.addField(`Пак: ${userEmoji[i].name}`, `${userEmoji[i].emojis}`, inline = true);
					if (userEmoji[i].type == "gold") {
						invEmbedPage2.addField(`Тип`, `${config.goldCoin}`, inline = true);
					} else {
						invEmbedPage2.addField(`Тип`, `${config.silverCoin}`, inline = true);
					}
				}

				pages = [invEmbedPage1,invEmbedPage2];
			}

			
			const emoji = ["⏪", "⏩"];
			const timeout = '45000';
			pagination(message, pages, emoji, timeout);
        } else {
        	message.channel.send(cmdError);
        }

	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "inventory",
	alias: "inv"
};