const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
        
		const reactName = "поцеловать";
        const reactCost = 40;
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
        let uid = message.author.id;

		var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830923108461969488/kiss2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923146050928690/kiss6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923160390991892/kiss3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923160631246879/kiss4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923161625165894/kiss9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923164837216286/kiss10.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923186455445544/kiss1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923179668406332/kiss5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923182735097886/kiss7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923184018554930/kiss8.gif",
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
            .setDescription(`${rUser} целует всех`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} целуется с ${mUser}`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reactionQestion = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${mUser}, ${rUser} хочет поцеловаться с вами`)
            .setColor(config.defaultColor)
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reactionNo = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser}, ${mUser} отказал(-а) вам`)
            .setColor(config.errColor)
            .setTimestamp();

            let reactionIgnore = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser}, ${mUser} проигнорировал(-а) вас`)
            .setColor(config.errColor)
            .setTimestamp();

        	if (!mUser || (rUser.id == mUser.id)) {
    	        message.channel.send(reactionAll);
        	} else {
                const msg = await message.channel.send(reactionQestion);
                await msg.react("✅");
                await msg.react("❌");
                await msg.awaitReactions((reaction, user) => user.id == mUser.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"),{max: 1, time:60000})
                .then(async collected => {
                    if(collected.first().emoji.name == "✅"){
                        msg.reactions.removeAll();
                        message.channel.send(reaction);
                        return;
                    } else if(collected.first().emoji.name == "❌"){
                        msg.edit(reactionNo);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async () => {
                    msg.edit(reactionIgnore);
                    msg.reactions.removeAll();
                    return;
                });
        	}
        }

		} catch(err) {
			if(err.name === "ReferenceError")
			console.log("У вас ошибка")
			console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "kiss"
};