const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		const ballCost = 50;
		let rUser = message.author;
        let uid = message.author.id;
        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }
		let answer = [
        "Бесспорно",
        "Предрешено",
        "Никаких сомнений",
        "Определённо да",
        "Можешь быть уверен в этом",
        "Мне кажется — «да»",
        "Вероятнее всего",
        "Хорошие перспективы",
        "Знаки говорят — «да»",
        "Да",
        "Пока не ясно, попробуй снова",
        "Спроси позже",
        "Лучше не рассказывать",
        "Сейчас нельзя предсказать",
        "Сконцентрируйся и спроси опять",
        "Даже не думай",
        "Мой ответ — «нет»",
        "По моим данным — «нет»",
        "Перспективы не очень хорошие",
        "Весьма сомнительно",
    	];

        //Получить дату с mongo
        profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

    	let randAnswer = answer[Math.floor(Math.random() * answer.length)];

    	let errorQuestion = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
        .setDescription(`Вы забыли задать вопрос.\n\nПример команды:\n` + "`" + `.8ball Я выиграю в казино?` + "`")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

    	let errorCoins = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
        .setDescription(`Недостаточно монет.\nВаш баланс: ${userCoins} ${config.silverCoin}`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        if (userCoins < ballCost) return message.channel.send(errorCoins);
        if (!message.content.slice(7) || message.content.slice(7) == "" || message.content.slice(7) == " ") return message.channel.send(errorQuestion);

        //снять деньги с юзера
        profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            $inc: {
                silverCoins: -ballCost
            }
        });
    	let ball = new Discord.MessageEmbed()
        .setTitle(`⸝⸝ ♡₊˚ Волшебный шар◞`)
        .setDescription(`**Вопрос:**\n${message.content.slice(7)}\n**Ответ:**\n${randAnswer}`)
        .setColor(config.defaultColor)
        .setFooter(`${rUser.tag} • ${ballCost} DSC`, `${rUser.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp();
		message.channel.send(ball);

		if(randAnswer == "Бесспорно") {
            profileData = await profileModel.findOne({ userID: uid });
            let achieve = profileData.achievements;

			const exclsName = `"Трасса 60"`;
			const exclsEmoji = "🎱";

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
        }
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	};
};

module.exports.help = {
	name: "8ball"
};