const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
        
		const reactName = "спать";
        const reactCost = 40;
		let rUser = message.author;
        let uid = message.author.id;

		var gifs = [
        "https://media.discordapp.net/attachments/830878676336902194/830925710125826058/sleep1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925726860443648/sleep9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925727829852225/sleep2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925736679833600/sleep8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925744574169088/sleep5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925747102679090/sleep7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925750353002536/sleep6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925751405903883/sleep4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925754786250752/sleep3.gif",
    	]

        profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

        if (userCoins < reactCost) {
            let errorCoins = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Недостаточно монет.\nВаш баланс: ${userCoins} ${config.silverCoin}`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();
            message.channel.send(errorCoins);
            return;
        } else {
            //снять деньги с юзера
            profileData = await profileModel.updateOne({
                userID: uid,
            }, {
                $inc: {
                    silverCoins: -reactCost
                }
            });

        	let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} спит`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

        	message.channel.send(reaction);
        }

		} catch(err) {
			if(err.name === "ReferenceError")
			console.log("У вас ошибка")
			console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "sleep"
};