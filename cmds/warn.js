const Discord = require('discord.js');
const fs = require('fs');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const warningModel = require('../schemas/warnSchema.js');
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
	.setDescription(`К сожалению, Вы не можете выдать предупреждение самому себе.`)
	.setTimestamp();

	let noUser = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Пользователь не найден.`)
	.setTimestamp();

	let userIsBanned = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Пользователь забанен.`)
	.setTimestamp();

	let userIsHigher = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Данный пользователь выше или на одной роли с Вами. Вы не можете выдать ему предупреждение.`)
	.setTimestamp();

	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	if (!mUser || mUser == mUser.user.bot) return message.channel.send(noUser);
	let uid = mUser.id;
	if (uid === rUser.id) return message.channel.send(sameErr);
	let reason = args.slice(1).join(' ');
	if (mUser.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send(userIsHigher);
	if (reason.length < 1) reason = 'Причина не указана.';
	if (mUser.roles.cache.has(config.rbRole)) return message.channel.send(userIsBanned);

	var dateStamp = new Date,
	dateToday = [dateStamp.getDate(),
	dateStamp.getMonth()+1,
	dateStamp.getFullYear()].join('/')+' '+
	[dateStamp.getHours(),
	dateStamp.getMinutes()].join(':');

	const newWarning = {
		warnedBy: rUser,
		timestamp: dateToday,
		reason: reason
	}

	let warnNum = 0;
    warnData = await warningModel.findOne({userID: uid});
	if (!warnData) {
		warns = await warningModel.create({
			userID: uid,
			warnsNumber: 1,
			warnings: newWarning,
		});
		//сохранение документа
		warns.save();
	} else {
		warnData = await warningModel.findOne({ userID: uid });
		warnNum = warnData.warnsNumber;

		if (warnNum >= 5) {
			//Забанить
			let banTime = 604800000;
			let reason = "Получено более 5ти предупреждений."

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
			    	$set: {
			    		timeout: banTime,
						reason: reason,
						rbGet: Date.now(),
			    	}
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

			message.channel.send(rbEmd);

			if (mUser.voice.channel != null) {
				mUser.voice.setChannel(null);
			}

			warnData = await warningModel.updateOne({
		    	userID: uid,
		    }, {
		    	$set: {
		    		warnsNumber: 0,
		    		warnings: "",
		    	}
		    });
		    return;
		}

		warnData = await warningModel.updateOne({
	    	userID: uid,
	    }, {
	    	$inc: {
	    		warnsNumber: 1
	    	},
	    	$push: {
	    		warnings: newWarning,
	    	}}
	    );
	}

	let warnEmd = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Предупреждения◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`${mUser} получил предупреждение **#${warnNum+1}**\n\n**Выдал: ${rUser}**\n\n**Причина: **` + "`" + reason + "`")
	.setTimestamp();

	message.channel.send(warnEmd);

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "warn"
};