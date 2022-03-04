const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
        
		const reactName = "признаться в любви";
        const reactCost = 40;
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
        let uid = message.author.id;

		var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830923736412586054/love2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923739130363984/love6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923744364331068/love7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923750597459998/love4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923750408716328/love5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923751305642004/love8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923754221338634/love3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830923754787700786/love9.gif",
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
            .setDescription(`${rUser} признаётся в любви всем`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} признаётся в любви ${mUser}`)
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

        profileData = await profileModel.findOne({ userID: uid });
        let achieve = profileData.achievements;

        const exclsName = `"Первая любовь"`;
        const exclsEmoji = "❤️";

        let newExclsEmbed = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
        .setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        achieveNew = achieve.toString();
        if (achieveNew.indexOf(exclsEmoji) > -1) {
            return;
        } else {
            achieveNew = achieveNew + exclsEmoji + " ";
            profileData = await profileModel.updateOne({
                userID: uid,
            }, {
                achievements: achieveNew,
            });
            let exclsGet = new Discord.MessageEmbed()
            .setColor(`${config.defaultColor}`)
            .setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
            .setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
            .setTimestamp();

            bot.users.cache.get(rUser.id).send(exclsGet);
            bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
        }

		} catch(err) {
			if(err.name === "ReferenceError")
			console.log("У вас ошибка")
			console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "love"
};