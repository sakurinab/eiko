const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        
        const reactName = "плакать";
        const reactCost = 40;
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830920948882341958/cry2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920956134162482/cry3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920974668136498/cry4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920976446521344/cry5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920992753975357/cry8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920992544129055/cry9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920997297193010/cry7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830920999917846538/cry6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830921165328875560/cry1.gif",
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
            .setDescription(`${rUser} плачет`)
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
    name: "cry"
};