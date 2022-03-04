const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		
		const reactName = "стрелять";
		const reactCost = 40;
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
		let uid = message.author.id;

		var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830925116652912700/shoot2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925119169757225/shoot6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925123162079262/shoot4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925124395466772/shoot8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925124978868234/shoot7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925125913935872/shoot3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925127423361124/shoot5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925127608172584/shoot1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925128614412318/shoot9.gif",
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

	    	let reactionAll = new Discord.MessageEmbed()
	        .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
	        .setDescription(`${rUser} выстрелил(-а) во всех.`)
	        .setColor(config.defaultColor)
	        .setImage(gifs[Math.floor(Math.random() * gifs.length)])
	        .setFooter(`${rUser.username} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
	        .setTimestamp();

	        let reaction = new Discord.MessageEmbed()
	        .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
	        .setDescription(`${rUser} выстрелил(-а) в ${mUser}`)
	        .setColor(config.defaultColor)
	        .setImage(gifs[Math.floor(Math.random() * gifs.length)])
	        .setFooter(`${rUser.username} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
	        .setTimestamp();

	    	if (!mUser) {
		        message.channel.send(reactionAll);
	    	} else {
	    		message.channel.send(reaction);
	    	}
    	}


		} catch(err) {
			if(err.name === "ReferenceError")
			console.log("У вас ошибка")
			console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "shoot"
};