const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        
        const reactName = "грустить";
        const reactCost = 40;
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830924814453309470/sad3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924822573088818/sad7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924825610158110/sad8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924831175737364/sad5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924838481821706/sad4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924840859861022/sad1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924841615753296/sad9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924848087695376/sad6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830924850221678612/sad2.gif",
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
            .setDescription(`${rUser} грустит`)
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
    name: "sad"
};