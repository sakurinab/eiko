const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
module.exports.run = async (bot,message,args) => {
	try{
		let rUser = message.mentions.users.first();
		if(!rUser) rUser = message.author;
		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		let embed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("Аватар")
		.setDescription(`[Ссылка на аватар](${rUser.displayAvatarURL({dynamic: true, size: 2048})})`)
		.setFooter(`${rUser.username}`)
		.setImage(`${rUser.displayAvatarURL({dynamic: true, size: 2048})}`)
		.setTimestamp();

		message.channel.send(embed);
	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "av",
	alias: "avatar"
};