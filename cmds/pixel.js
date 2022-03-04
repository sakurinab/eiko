const Discord = require('discord.js');
const fs = require('fs');
const config = require('../botconfig.json');
const Canvas = require('canvas');
const path = require('path');

module.exports.run = async (bot,message,args) => {
    try{
    	if (!message.member.roles.cache.has('852227884164972584')) return message.channel.send('К сожалению, вы не имеете роль тестера, чтобы сделать это.');

    	const canvas = Canvas.createCanvas(960, 540);
		// const ctx = canvas.getContext('2d');
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		function drawPixel(x, y, color) {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, 1, 1);
		}

		drawPixel(args[0], args[1], args[2]);
		const buffer = canvas.toBuffer();

		let attachment = new Discord.MessageAttachment(buffer)
		message.channel.send('', attachment)

    } catch(err) {
        if(err.name === "ReferenceError")
        console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "pixel"
};