const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const loveroomModel = require('../schemas/loveroomSchema.js');
//цены
loveroomCost = 15000;

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;
		let rMember = message.member;

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userMarriage = profileData.marriage;

        let noMarried = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`Сначала заключите брак.`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Недостаточно серебра. Стоимость любовной комнаты: ${loveroomCost} ${config.silverCoin}\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let alreadyHaveLR = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`У Вас уже есть любовная комната!`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let created = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Любовные комнаты◞")
        .setDescription(`Комната была создана! Хорошего Вам времяпрепровождения.\n\nВаш баланс: ${userCoins - loveroomCost} ${config.silverCoin}`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

		if (userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет") return message.channel.send(noMarried);
		if (userCoins < loveroomCost) return message.channel.send(errorCoins);

		let loveroomId = 0;
		clrData = await loveroomModel.findOne({ userID: uid });
		if (!clrData) {
			clr = await loveroomModel.create({
				userID: uid,
				loveroomID: 0,
				loveroomTimestamp: Date.now(),
				loveroomLastpayment: Date.now(),
			});
			//сохранение документа
			clr.save();
		} else {
			loveroomId = clrData.loveroomID;
		}

		if (loveroomId != 0) return message.channel.send(alreadyHaveLR);

		let mUser = bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage);

		let channelName = rUser.username + " 💞 " + mUser.user.username;

		rMember.guild.channels.create(channelName, {
			type: 'voice',
			userLimit: 2,
			parent: config.loveroomsCategory,
			permissionOverwrites: [{
				id: rMember.id,
				allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},{
				id: mUser.id,
				allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},{
				id: config.everyoneID,
				deny: ['CONNECT', 'SPEAK'],
			},{
				id: config.nonverifiedUserRole,
				deny: ['VIEW_CHANNEL']
			}]
		}).then( async channel => {
			try {
				//присвоить айди созданного канала к профайлу
				newLoveroomID = channel.id;

				clrResponce = await loveroomModel.updateOne({
					userID: uid,
				}, {
					$set: {
						loveroomID: newLoveroomID
					}
				});

				clrData = await loveroomModel.findOne({ userID: mUser.id });

				if (!clrData) {
					clr = await loveroomModel.create({
						userID: mUser.id,
						loveroomID: newLoveroomID,
						loveroomTimestamp: Date.now(),
						loveroomLastpayment: Date.now(),
					});
					//сохранение документа
					clr.save();
				} else {
					clrResponce = await loveroomModel.updateOne({
						userID: mUser.id,
					}, {
						loveroomID: newLoveroomID,
						loveroomTimestamp: Date.now(),
						loveroomLastpayment: Date.now(),
					});
				}

				profileData = await profileModel.updateOne({
		            userID: uid,
		        }, {
		        	$inc: {
		        		silverCoins: -loveroomCost
		        	}
		        });

				message.channel.send(created);
			} catch (err) {
				console.warn(err);
			}
		});

	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "createloveroom",
	alias: "clr"
};