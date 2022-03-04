const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
        
		const reactName = "погладить";
        const reactCost = 40;
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
        let uid = message.author.id;

		var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830924289649279027/pat2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924290462318653/pat4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924296862826536/pat6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924297929228298/pat5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924301913161758/pat3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924303700721735/pat7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924305817665556/pat1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924317075308574/pat8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924322435760180/pat9.gif",
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
            .setDescription(`${rUser} гладит всех`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} гладит ${mUser}`)
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
	name: "pat"
};