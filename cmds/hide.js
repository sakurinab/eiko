const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        
        const reactName = "спрятаться";
        const reactCost = 40;
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830922232473190430/hide4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922243101163560/hide6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922252672565268/hide3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922264987959346/hide1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922273875034183/hide5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922283659952198/hide9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922283798626314/hide8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922290559582328/hide2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830922293714223144/hide7.gif",
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
            .setDescription(`${rUser} пpячeтcя`)
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
    name: "hide"
};