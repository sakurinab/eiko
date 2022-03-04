const Discord = require('discord.js');
const fs = require('fs');
const config = require('../botconfig.json');
const Canvas = require('canvas');
const path = require('path');

module.exports.run = async (bot,message,args) => {
    try{
    	if (!message.member.roles.cache.has('852227884164972584')) return message.channel.send('К сожалению, вы не имеете роль тестера, чтобы сделать это.');

    	const canvas = Canvas.createCanvas(960, 540);
    	Canvas.registerFont(path.join(__dirname, '../LucyGlitch.ttf'), { family: 'LucyGlitch' })
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage(
			path.join(__dirname, '../derabbitbanner.png')
		);

		ctx.drawImage(background, 0, 0);

		ctx.fillStyle = '#ffffff';
		ctx.font = '60px "LucyGlitch"';

		function checkTime(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}
		var today = new Date();
		today.setHours(today.getHours() + 3)
		var h = checkTime(today.getHours());
		var m = checkTime(today.getMinutes());

		y = 225;
		x = 203;

		let text = `${h}:${m}`
		ctx.fillText(text, x, y);

		y = y + 125;

		text = bot.guilds.cache.get(config.serverId).memberCount;
		ctx.fillText(text, x, y);

		y = y + 135;

		let allVoiceChannels = bot.channels.cache.filter(c => c.type === 'voice');
		let userCount = 0;
		for (const [id, voiceChannel] of allVoiceChannels) userCount += voiceChannel.members.size;
		text = userCount;
		ctx.fillText(text, x, y);

		let attachment = new Discord.MessageAttachment(canvas.toBuffer())
		message.channel.send('', attachment)

    } catch(err) {
        if(err.name === "ReferenceError")
        console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "bannercheck"
};