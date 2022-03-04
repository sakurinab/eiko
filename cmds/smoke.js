const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        
        const reactName = "курить";
        const reactCost = 40;
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830925987281764352/smoke1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925988787126292/smoke2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925995074650162/smoke6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926004569505803/smoke3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926009511051354/smoke11.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926016016547850/smoke5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926016099647508/smoke4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926025188835368/smoke7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926032402907176/smoke9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926035482574924/smoke8.gif",
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
            .setDescription(`${rUser} курит`)
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
    name: "smoke"
};