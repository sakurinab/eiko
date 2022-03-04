const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const codeModel = require('../schemas/codeSchema.js');
//codes
//DE####-RA####-BB####-IT####
const codes = [
        {
            code: "DET611-RAX7D1-BBYJNC-ITWSBO",
            gold: 100,
            silver: 10000,
            reputation: 35,
            xp: 50
        },
        // { ---USED
        //     code: "DEGX1R-RAW031-BB8LON-ITM75Z",
        //     gold: 10,
        //     silver: 0,
        //     reputation: 0,
        //     xp: 0
        // },
        // { ---USED
        //     code: "DEN2FN-RAYFTB-BBFP6G-ITIAVZ",
        //     gold: 50,
        //     silver: 2000,
        //     reputation: 200,
        //     xp: 500
        // },
        // { ---USED
        //     code: "DE4D0G-RAH4U5-BB3HSD-ITQV5Y",
        //     gold: 15000,
        //     silver: 500000,
        //     reputation: 0,
        //     xp: 0
        // },
        {
            code: "DE7KVW-RA6VSO-BBVWL3-ITH483",
            gold: 50,
            silver: 1000,
            reputation: 150,
            xp: 100
        },
        // {
        //     code: "DEAHP4-RAM0HM-BB1W9U-IT4W3V",
        //     gold: 10,
        //     silver: 300,
        //     reputation: 35,
        //     xp: 50
        // },
        // {
        //     code: "DERMZO-RAWB1O-BBI5B8-IT4FNQ",
        //     gold: 10,
        //     silver: 300,
        //     reputation: 35,
        //     xp: 50
        // },
        {
            code: "DERBIY-RA41CR-BBKJJM-ITH7GS",
            gold: 10,
            silver: 300,
            reputation: 35,
            xp: 50
        },
        // {
        //     code: "DEMTKS-RA3XX1-BBSWZH-ITT98Q",
        //     gold: 10,
        //     silver: 300,
        //     reputation: 35,
        //     xp: 50
        // },
        // {
        //     code: "DEO6W9-RARTF6-BBM9I8-ITIV9N",
        //     gold: 10,
        //     silver: 300,
        //     reputation: 35,
        //     xp: 50
        // },
    ];
module.exports.run = async (bot,message,args) => {
    try{
        message.delete();
        let rUser = message.author;
        let uid = message.author.id;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        let noCode = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Укажите подарочный код.`)
        .setTimestamp();

        let notValid = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Срок данного подарочного кода истёк или код не был найден.`)
        .setTimestamp();

        let codeUsed = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Данный код уже был использован Вами!`)
        .setTimestamp();

        if (!args[0]) return message.channel.send(noCode);
        let msgCode = args[0];
        let index = codes.findIndex(x => x.code === msgCode);

        if (index == -1) return message.channel.send(notValid);

        codeData = await codeModel.findOne({ userID: uid });

        let userCodes = [];

        if (!codeData) {
            code = await codeModel.create({
                userID: uid,
            });
            //сохранение документа
            code.save();

            userCodes = [];
        } else {
            userCodes = codeData.code;
        }

        if (userCodes.findIndex(x => x == msgCode) != -1) return message.channel.send(codeUsed);

        //profileData = await profileModel.findOne({ userID: uid });

        codeData = await codeModel.updateOne({
            userID: uid,
        }, {
            $push: {
                code: msgCode,
            }}
        );

        profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            $inc: {
                reputation: codes[index].reputation,
                goldCoins: codes[index].gold,
                silverCoins: codes[index].silver,
                reputation: codes[index].reputation,
                xp: codes[index].xp,
            }
        });

        let rewardString = "";

        if (codes[index].gold > 0) {rewardString += `・ Золото: ${codes[index].gold} ${config.goldCoin}\n`};
        if (codes[index].silver > 0) {rewardString += `・ Серебро: ${codes[index].silver} ${config.silverCoin}\n`};
        if (codes[index].xp > 0) {rewardString += `・ Опыт: ${codes[index].xp} 🔖\n`};
        if (codes[index].reputation > 0) {rewardString += `・ Репутация: ${codes[index].reputation} 🎭\n`};

        let rewardEmbed = new Discord.MessageEmbed()
            .setColor(`${config.defaultColor}`)
            .setTitle(`⸝⸝ ♡₊˚ Подарочный код◞`)
            .setDescription(`Код был активирован! Вы получили: \n${rewardString}`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        message.channel.send(rewardEmbed);

    } catch(err) {
        if(err.name === "ReferenceError")
        console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "code"
};