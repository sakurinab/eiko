const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
    try{
        const reactName = "злиться";
        const reactCost = 40;
        let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
        let rUser = message.author;
        let uid = message.author.id;

        var gifs = [
        "https://media.discordapp.net/attachments/830878676336902194/830919506380849172/angry1.gif",
        "https://media.discordapp.net/attachments/830878676336902194/830919514702872646/angry3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919519530254366/angry2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919522252488714/angry9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919526539067444/angry6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919527566540841/angry7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919527914012712/angry8.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919530095706172/angry5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830919534768422962/angry4.gif",
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
            .setDescription(`${rUser} очень злится`)
            .setColor(config.defaultColor)
            .setImage(gifs[Math.floor(Math.random() * gifs.length)])
            .setFooter(`${rUser.tag} • ${reactCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

            let reaction = new Discord.MessageEmbed()
            .setTitle(`⸝⸝ ♡₊˚ Реакция: ${reactName} ◞`)
            .setDescription(`${rUser} очень злится на ${mUser}`)
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
    name: "angry"
};