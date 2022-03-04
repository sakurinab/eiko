const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        
        const reactName = "депрессия";
        const reactCost = 40;
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830921955556196383/depression4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921957233918002/depression1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921960757395476/depression9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921963521572874/depression7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921986674262046/depression5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921990247940156/depression2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921996506234994/depression8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921997663731712/depression6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921998908784760/depression3.gif",
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
            .setDescription(`${rUser} впал(-а) в депрессию`)
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
    name: "depression"
};