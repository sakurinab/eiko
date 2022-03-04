const Discord = require('discord.js');
const fs = require('fs');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const warningModel = require('../schemas/warnSchema.js');
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

	let noUser = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Пользователь не найден.`)
	.setTimestamp();

	let noWarns = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Предупреждения◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`У ${mUser} нет предупреждений!`)
	.setTimestamp();

	if(!mUser || mUser.id == config.botId) return message.channel.send(noUser);
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	let uid = mUser.id;

	let warnsString = "";

	warnData = await warningModel.findOne({ userID: uid });
	if (!warnData) return message.channel.send(noWarns);
    let warns = warnData.warnsNumber;
    let warnsArray = warnData.warnings;

	if (warns == 0) return message.channel.send(noWarns);

	for (let i = 0; i < warns; i++) {
		warnsString += `#${i+1} Выдал: <@${warnsArray[i].warnedBy}>\nПричина:` + "`" + warnsArray[i].reason + "`" + `\nДата: ` + "`" + warnsArray[i].timestamp + "`" + `\n\n`
	}

	let warnList = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Предупреждения◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Предупреждения ${mUser}:\n\n` + warnsString)
	.setTimestamp();

	message.channel.send(warnList);

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}


};

module.exports.help = {
	name: "warns"
};