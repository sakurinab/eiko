const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
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
        let userCoins = profileData.silverCoins;
        let userGoldCoins = profileData.goldCoins;

        invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
				eqEmoji: 0,
			});
			//сохранение документа
			inv.save();
		}

		let userRoles = invData.invRoles;
        let userPLine = profileData.profileLine;

        //.buy role <index>
        //.buy emoji <index>

        let cmdError = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Неизвестная команда.\n\nПример:\n` + '`' + `.eq role <1-${userRoles.length}>` + '`\n' + '`' + `.eq emoji <1-5>` + '`')
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

        if (args[0] == "role" || args[0] == "roles") {

        	let alredyUnEquiped = new Discord.MessageEmbed()
			.setColor(userPLine)
			.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
			.setDescription(`Роль не надета!`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

			let noRole = new Discord.MessageEmbed()
			.setColor(userPLine)
			.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
			.setDescription(`У Вас нет такой роли.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

        	if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(cmdError);

			userIndex = args[1];
			if (userRoles.find(x => x.index == userIndex)) {
				eqRoleId = userRoles.find(x => x.index == userIndex).id;
				if (!member.roles.cache.has(eqRoleId)) return message.channel.send(alredyUnEquiped);
				member.roles.remove(eqRoleId);

				let unEquiped = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setDescription(`Роль <@&${eqRoleId}> была снята.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				message.channel.send(unEquiped);
			} else {
				message.channel.send(noRole);
			}
        } else if (args[0] == "emoji" || args[0] == "emojis") {
        	let alredyUnEquiped = new Discord.MessageEmbed()
			.setColor(userPLine)
			.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
			.setDescription(`Пак уже убран из профиля!`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

			let noPack = new Discord.MessageEmbed()
			.setColor(userPLine)
			.setTitle("⸝⸝ ♡₊˚ Инвентарь эмоджи◞")
			.setDescription(`У Вас нет такого пака.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

        	if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(cmdError);

        	invData = await invModel.findOne({ userID: uid });
			userEmoji = invData.invEmoji;
			eqEmoji = invData.eqEmoji;

			userIndex = args[1];
			if (userEmoji.find(x => x.index == userIndex)) {
				if (eqEmoji != userIndex) return message.channel.send(alredyUnEquiped);

				emojiName = userEmoji.find(x => x.index == userIndex).name;
				invData = await invModel.updateOne({
		        	userID: uid,
			    }, {
			    	eqEmoji: 0,
			    });

				let unEquiped = new Discord.MessageEmbed()
				.setColor(userPLine)
				.setTitle("⸝⸝ ♡₊˚ Инвентарь ролей◞")
				.setDescription(`Пак эмоджи <${emojiName}> был успешно убран из Вашего профиля.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				message.channel.send(unEquiped);
			} else {
				message.channel.send(noPack);
			}
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
	name: "unequip",
	alias: "uneq"
};