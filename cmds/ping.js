const Discord = require('discord.js');
const fs = require('fs');
module.exports.run = async (bot,message,args) => {
	
	message.channel.send(`🏓 Понг!\nshiomi.: ${Date.now() - message.createdTimestamp}мс.\nAPI задержка: ${Math.round(bot.ws.ping)}мс`);
};

module.exports.help = {
	name: "ping"
};