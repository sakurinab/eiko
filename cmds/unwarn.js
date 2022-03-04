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

	let noNum = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Вы забыли указать номер предупреждения.`)
	.setTimestamp();

	let noWarnIn = new Discord.MessageEmbed()
	.setColor(`${config.errColor}`)
	.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`Такого предупреждения нет.`)
	.setTimestamp();

	let unWarned = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Предупреждения◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`${rUser} снял предупреждение #${args[1]} с ${mUser}`)
	.setTimestamp();

	if(!mUser || mUser.id == config.botId) return message.channel.send(noUser);
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permErr);
	let uid = mUser.id;

	if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(noNum);
	let index = args[1]-1;

	warnData = await warningModel.findOne({ userID: uid });
    let warns = warnData.warnsNumber;
    let warnsArray = warnData.warnings;

    //console.log(warns + " " + uid);

	if (warns == 0) return message.channel.send(noWarns);
	if (args[1] > warns) return message.channel.send(noWarnIn);

	warnsArray.splice(index, 1);

	warnData = await warningModel.updateOne({
    	userID: uid,
    }, {
    	warnsNumber: warnData.warnsNumber - 1,
    	warnings: warnsArray.flat(),
    });

	message.channel.send(unWarned);

	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}


};

module.exports.help = {
	name: "unwarn"
};