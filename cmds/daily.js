const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const dailyModel = require('../schemas/dailySchema.js');
const invModel = require('../schemas/inventorySchema.js');

module.exports.run = async (bot, message, args) => {
    try {
        let uid = message.author.id;
        let rUser = message.author;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        dailyData = await dailyModel.findOne({
            userID: uid
        });
        if (!dailyData) {
            daily = await dailyModel.create({
                userID: uid,
                timeout: 0,
                dailysget: 0,
                lastdaily: 0,
                weekdaily: 1,
            });
            //сохранение документа
            daily.save();
        }

        profileData = await profileModel.findOne({
            userID: uid
        });
        let userLvl = profileData.lvl;
        dailyData = await dailyModel.findOne({
            userID: uid
        });
        let userTimeOut = parseInt(dailyData.timeout);
        let userLastdaily = dailyData.lastdaily;
        let userDailys = dailyData.dailysget;
        let dayof = dailyData.weekdaily;
        
        let timeOut = (43200000 - (Date.now() - userTimeOut));
        const seconds = Math.floor((timeOut / 1000) % 60);
        const minutes = Math.floor((timeOut / 1000 / 60) % 60);
        const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

        if ((Date.now() - userTimeOut > 43200000)) {
            if ((Date.now() - userLastdaily) > 129600000) {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                	$set: {
                		dailysget: 0,
                    	weekdaily: 1
                	}
                });
                dayof = 1;
            }
            if (dayof > 7) {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        dailysget: 1,
                    },
                    $set: {
                        timeout: Date.now(),
                        lastdaily: Date.now(),
                        weekdaily: 1,
                    }
                });
                dayof = 1;
            } else {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        dailysget: 1,
                        weekdaily: 1
                    },
                    $set: {
                        timeout: Date.now(),
                        lastdaily: Date.now()
                    }
                });
            }

            let dailyReward = 60 + (20 * (userDailys + 1));
            let oneXp = Math.floor((100 * userLvl) / 100)

            let dailyEmbed = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle(`⸝⸝ ♡₊˚ Ежедневная награда◞`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            let silverE = `${config.silverCoin}`;
            let goldE = `${config.goldCoin}`;
            let xpE = `🔖`;
            let repE = `🎭`;
            let eqEmoji = 0;
            invData = await invModel.findOne({
                userID: uid
            });
            eqEmoji = invData.eqEmoji;
            if (invData && eqEmoji > 0) {
                userEmoji = invData.invEmoji;
                emojiList = userEmoji.find(x => x.index == eqEmoji).emojis;
                if (emojiList) {
                    silverE = emojiList.split(" ")[0];
                    goldE = emojiList.split(" ")[1];
                    xpE = emojiList.split(" ")[4];
                    repE = emojiList.split(" ")[6];
                }
            }

            if (dayof == 1) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Серебро: ${dailyReward} ${silverE}\nЗа использование команды 1 день подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                    }
                });
            } else if (dayof == 2) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*4} ${xpE} \nЗа использование команды 2 дня подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 4),
                    }
                });
            } else if (dayof == 3) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*6} ${xpE} \n ・ Репутация: 10 ${repE} \nЗа использование команды 3 дня подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 6),
                        reputation: 10,
                    }
                });
            } else if (dayof == 4) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*7} ${xpE} \n ・ Репутация: 20 ${repE} \nЗа использование команды 4 дня подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 7),
                        reputation: 20,
                    }
                });
            } else if (dayof == 5) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*8} ${xpE} \n ・ Репутация: 30 ${repE} \nЗа использование команды 5 дней подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 8),
                        reputation: 30,
                    }
                });
            } else if (dayof == 6) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Золото: 10 ${goldE}\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*11} ${xpE} \n ・ Репутация: 40 ${repE} \nЗа использование команды 6 дней подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 11),
                        reputation: 30,
                        goldCoins: 10,
                    }
                });
            } else if (dayof == 7) {
                dailyEmbed.setDescription(`Вы получили:\n ・ Золото: 40 ${goldE}\n ・ Серебро: ${dailyReward} ${silverE}\n ・ Опыт: ${oneXp*14} ${xpE} \n ・ Репутация: 40 ${repE} \nЗа использование команды 7 дней подряд. Команда снова станет доступна через 12 часов.`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                        xp: (oneXp * 14),
                        reputation: 40,
                        goldCoins: 40,
                    }
                });
                //знак отличия
                profileData = await profileModel.findOne({
                    userID: uid
                });
                let achieve = profileData.achievements;
                const exclsName = `"Частый гость"`;
                const exclsEmoji = "🐰";

                let newExclsEmbed = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
                    .setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();

                achieveNew = achieve.toString();
                if (!(achieveNew.indexOf(exclsEmoji) > -1)) {
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
            }

            message.channel.send(dailyEmbed);
        } else {
            let dailyEmbedErr = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setDescription(`Награда будет доступна через: **${hours}ч. ${minutes}м. ${seconds}с.**`)
                .setTimestamp();

            message.channel.send(dailyEmbedErr);
        }
    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "daily",
    alias: "timely"
};