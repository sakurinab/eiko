const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		const reactName = "ударить";
        const reactCost = 40;
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
        let uid = message.author.id;

		var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830922526498226196/hit1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922533061525514/hit8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922547167756298/hit6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922551429431296/hit4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922559876628480/hit3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922564477648916/hit2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922565153063040/hit5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922576028500028/hit9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922577022287892/hit7.gif",
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
            .setDescription(`${rUser} ударил(-а) всех`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} ударил(-а) ${mUser}`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
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
	name: "hit"
};