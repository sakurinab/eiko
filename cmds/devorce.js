const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const loveroomModel = require('../schemas/loveroomSchema.js');

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;
		let rMember = message.member;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		profileData = await profileModel.findOne({ userID: uid });
        let userMarriage = profileData.marriage;

        let success = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Браки◞")
        .setDescription(`${rUser} развёлся с <@${userMarriage}>`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let noMarried = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("⸝⸝ ♡₊˚ Браки◞")
        .setDescription(`Вы не состоите в браке.`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        if (userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет") return message.channel.send(noMarried);

        let mUser = bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage);

        profileDataMUser = await profileModel.findOne({ userID: uid });
        let mUserMarriage = profileDataMUser.marriage;;

		profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            marriage: "Нет",
        });

        profileData = await profileModel.updateOne({
            userID: mUser.id,
        }, {
            marriage: "Нет",
        });

        let loveroomId = 0;
        clrData = await loveroomModel.findOne({ userID: uid });
        if (clrData) {
            loveroomId = clrData.loveroomID;
            if (loveroomId != 0) {
                clrResponce = await loveroomModel.updateOne({
                    userID: uid,
                }, {
                    loveroomID: 0,
                    loveroomTimestamp: 0,
                    loveroomLastpayment: 0,
                });

                clrResponce = await loveroomModel.updateOne({
                    userID: mUser.id,
                }, {
                    loveroomID: 0,
                    loveroomTimestamp: 0,
                    loveroomLastpayment: 0,
                });

                bot.channels.cache.find(ch => ch.id == loveroomId).delete();
            }
        }

        rMember.roles.remove(config.inLoveRole);
        mUser.roles.remove(config.inLoveRole);

        message.channel.send(success);

	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "divorce"
};