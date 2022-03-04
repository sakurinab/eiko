const Discord = require('discord.js');
const fs = require('fs');
const Teiko = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const dailyModel = require('../schemas/dailySchema.js');
const invModel = require('../schemas/inventorySchema.js');
const eventList = [{
		"id": "alias",
		"name": "шляпа",
		"info": "За ограниченное время объяснить партнёру как можно больше слов, \"вытянутых\" из шляпы.",
		"time": "~30 минут"
	},{
		"id": "codenames",
		"name": "коднеймс",
		"info": "Две команды - синяя и красная (3 при большом количестве участников). Мастера, используя ассоциации, связывают слова цвета их команд. А игроки стараются быстрее открыть все слова своего цвета на поле. (Ассоциация объединяет сразу несколько слов/число - их количество). Также на поле есть черное слово, попав на которое, команда автоматически проигрывает.",
		"time": "~20 минут"
	},{
		"id": "drawit",
		"name": "крокодил",
		"info": "Игроки по очереди рисуют одно из предложенных слов, а остальные угадывают и пишут догадки в специальный чат на сайте. Люди, угадавшие слово, могут подсказывать, но не напрямую.",
		"time": "~15 минут"
	},{
		"id": "mafia",
		"name": "мафия",
		"info": "▪ 6 - 8 игроков: две мафии (один из них ДОН), доктор, комиссар, остальные мирные жители.\n▪ 9 - 10 игроков: три мафии (один из них ДОН), доктор, комиссар, остальные мирные жители.\n▪ 11-14 игроков: четыре мафии (один из них ДОН), доктор, комиссар, остальные мирные жители.",
		"time": "~1 час"
	},{
		"id": "jeopardy",
		"name": "своя игра",
		"info": "На усмотрение Ведущего определяется игрок, первым выбирающий любой вопрос из таблицы на экране. Затем у каждого из участников появляется возможность ответить на вопрос, нажав на красную кнопку/правую кнопку мыши или клавишу \"CTRL\". Ответ произносится устно, либо в специальном чате на сайте. Следующим выбирает участник, правильно ответивший на вопрос.",
		"time": "~20 минут"
	},{
		"id": "songtrivia",
		"name": "угадай песню",
		"info": "В начале раунда выбирается жанр угадываемых песен и их количество. Старт - игроки слышат отрывок песни и выбирают предполагаемое название из предложенных вариантов. Угадай все песни правильно и получи звание настоящего меломана!",
		"time": "~20 минут"
	},{
		"id": "garticphone",
		"name": "сломанный телефон",
		"info": "Для участия в игре не нужно быть умелым художником, достаточно обладать элементарными навыками рисования и уметь \"включать\" собственное воображение. Время каждого раунда ограничено. После завершения игрового круга, результат изображения совершенно не соответствует первоначальному слову. Вы начинаете разбирать все нарисованные версии и от души веселитесь над смешными картинками!",
		"time": "~20 минут"
	},{
		"id": "bunker",
		"name": "бункер",
		"info": "На земле произошла катастрофа. Таких катастроф семь видов. Каждая из них описывает состояние планеты и количество выживших. Персонажи состоят из семи характеристик: профессия, здоровье и другая информация. У каждого игрока две цели. Личная – попасть в бункер, чтобы возрождать планету. Командная — проследить, чтобы в бункер попали только здоровые и пригодные к выживанию люди. В ходе игры вы постепенно раскрываете своего персонажа, показываете сильные карты и объясняете, почему именно вы должны выжить. Можете менять ход игры: используйте смены карт, перераздачи и иммунитеты. Игра отлично развивает дискуссионные навыки и навыки убеждения.\nНа основании голосования игроки должны выбрать, кто из них попадёт в спасительный бункер. Чтобы определить, кто из героев попадет в бункер, необходимо выбрать самых полезных для восстановления жизни на постапокалиптической планете. Группа выживших будет возрождать быт и население Земли. Оружия и насилия нет, только дискуссия и обоснование своей важности и необходимости.",
		"time": "~1 час"
	},{
		"id": "amongus",
		"name": "among us",
		"info": "Игроки должны отыскать в рядах команды космического корабля предателя, чья цель - всех убить. Предателю же необходимо убить как можно больше \"товарищей\" по команде, пока его не рассекретили.",
		"time": "~15 минут"
	},{
		"id": "truthordare",
		"name": "правда или действие",
		"info": "Игрок выбирает, что он будет делать: отвечать на вопрос (правда) или выполнять действие. Говорить можно только правду. \nКаждый участник по очереди должен честно отвечать на поставленный вопрос или выполнить заданное ему действие.",
		"time": "~45 минут"
	}];

module.exports.run = async (bot, message, args) => {
	try {
		let rUser = message.author;
		let mUser = message.guild.member(message.guild.members.cache.get(args[5]) || message.mentions.users.first());

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
			bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
			message.delete();
			return;
		}

		let noPerms = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`К сожалению, вы не можете сделать это.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();
		if (!message.member.roles.cache.has(config.eventerRole) && !message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPerms)

		//          0         1         2              3                 4           5
		//.event create <название> <награда-золото> <награда-серебро> <начало-в> <@ивентёр>
		//.event list

		let noEventName = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли указать название ивента.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let eventDoesntExist = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Такого ивента нет в списке.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let noGold = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли указать награду в виде золота.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let noSilver = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли указать награду в виде серебра.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let noTime = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли указать время начала ивента.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let noEventer = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
		.setDescription(`Вы забыли указать ивентёра.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		let announced = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("⸝⸝ ♡₊˚ Ивенты◞")
		.setDescription(`Ивент был объявлен, а комната создана.`)
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		if (args[0] == "create") {
			let goldReward = 0;
			let silverReward = 0;

			if (!args[1]) return message.channel.send(noEventName);
			let index = eventList.findIndex(x => x.id.toLowerCase() === args[1].toLowerCase());
			if (index == -1) return message.channel.send(eventDoesntExist);
			if (!args[2] || isNaN(args[2])) return message.channel.send(noGold);
			if (args[2] > 0) goldReward = args[2];
			if (!args[3] || isNaN(args[3])) return message.channel.send(noSilver);
			if (args[3] > 0) silverReward = args[3];
			if (args[4] == null || args[4] == " " || args[4] == "") return message.channel.send(noTime);
			if (!mUser) return message.channel.send(noEventer);

			let eID = eventList[index].id;
			let eName = eventList[index].name;
			let info = eventList[index].info;
			let time = eventList[index].time;
			let startAt = args[4];
			let reward = ``;
			if (goldReward != 0 && silverReward != 0) {
				reward = `${goldReward} ${config.goldCoin} | ${silverReward} ${config.silverCoin}`;
			} else if (goldReward != 0) {
				reward = `${goldReward} ${config.goldCoin}`;
			} else if (silverReward != 0) {
				reward = `${silverReward} ${config.silverCoin}`;
			} else if (goldReward == 0 && silverReward == 0) {
				reward = `Нет`;
			}

			message.member.guild.channels.create(`✧・${eName}`, {
				type: 'voice',
				parent: config.eventCategory,
				permissionOverwrites: [{
					id: config.localBanRole,
					deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
				}, {
					id: config.rbRole,
					deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
				},{
					id: config.eventBanRole,
					deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
				}]
			}).then( voice => {
				let eventEmbed = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle(`⸝⸝ ♡₊˚ Teiko | ${eName.toUpperCase()}◞`)
					.setImage(`https://media.discordapp.net/attachments/913720771375935488/914151810367889418/shiomu_baner.gif`)
					.setDescription(`・Привет, дорогой пользователь! В ${startAt} будет проведён ивент \"${eName}\"!\n\n**Об игре:**` + '```' + info + '```\n\n')
					.addField("**🎲 Название:**", `"${eName}"`, inline = true)
					.addField("**🕓 Начало:**", `${startAt}`, inline = true)
					.addField("**⏳ Длительность:**", `${time}`, inline = true)
					.addField("**🎙️ Комната ивента:**", `<#${voice.id}>`, inline = true)
					.addField("**🏆 Награда:**", `${reward}`, inline = true)
					.addField("**👤 Проводит:**", `${mUser}`, inline = true)
					.setFooter(`Удачной игры!`)
					.setTimestamp();

				bot.channels.cache.get(config.eventNewsChannel).send(`<@&${config.eventMemberRole}>`, eventEmbed);
				message.channel.send(announced);
			})
		} else if (args[0] == "list") {
			let gameList = ``;
			eventList.forEach(obj => {
				gameList += `・ **${obj.id}** (${obj.name})\n`
			})

			let eventListEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ Teiko | Ивенты◞`)
				.setDescription(gameList)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(eventListEmbed);
		} else if (args[0] == "info") {
			if (!args[1]) return message.channel.send(noEventName);
			let index = eventList.findIndex(x => x.id.toLowerCase() === args[1].toLowerCase());
			if (index == -1) return message.channel.send(eventDoesntExist);

			let eID = eventList[index].id;
			let eName = eventList[index].name;
			let info = eventList[index].info;
			let time = eventList[index].time;

			let eventEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ Teiko | ${eName.toUpperCase()}◞`)
				.setDescription(`・Информация о \"${eName}\"\n\n**🎲 Название: ${eID} (${eName})**\n**⏳ Длительность: ${time}**\n\n**Об игре:**` + '```' + info + '```')
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(eventEmbed);
		} else {
			let eventListEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ Teiko | Ивенты◞`)
				.setDescription(`**.event help** - это сообщение\n**.event list** - лист возможных ивентов\n**.event create <ивент> <золото-за-победу> <серебро-за-победу> <начало-в> <@ивентёр>** - объявить об ивенте\n> Пример: ` + '`' + `.event create codenames 15 0 22:00 @Zlo#0001` + '`\n' + `**.event info <ивент>** - информация об ивенте`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(eventListEmbed);
		}

	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "event"
};