const Discord = require('discord.js');
const fs = require('fs');
const shiomi = require('../package.json');
const config = require('../botconfig.json');
const pagination = require('discord.js-pagination');
//mongoose
const mongoose = require('mongoose');
const invModel = require('../schemas/inventorySchema.js');

//магазин эмоджи
const emojiShop = [
	{"index": 1, "packEmoji": `${config.silverCoin} ${config.goldCoin} 💬 ☠️ 🔖 🕹️ 🎭 💞 ⚔️ 🎙️ 🏅`, "packName": "teiko.", "price": "1000", "type": "silver"},
	{"index": 2, "packEmoji": `🤍 💛 💌 💢 🎀 🎈 💥 💕 🌹 🎤 🧿`, "packName": "Lovely", "price": "2000", "type": "silver"},
	{"index": 3, "packEmoji": `⚪ 🟡 🔻 ⬛ ◻ ⬜ 🔺 🔶 🔷 🔲 🔳`, "packName": "Aesthetic", "price": "4000", "type": "silver"},
	{"index": 4, "packEmoji": `💀 ☠️ ⛓️ ❕ 🎓 ⚰️ 🧟‍♂️ 🖤 🗑️ 🔝 👑 `, "packName": "Lunapack", "price": "6000", "type": "silver"},
	{"index": 5, "packEmoji": `🍼 🍯 🍎 🧂 🥚 🍳 🍪 🍭 🍰 🍕 🥓`, "packName": "Foodie", "price": "8000", "type": "silver"},
	{"index": 6, "packEmoji": `🎆 🎇 ✨ 🧨 🎉 🎊 🎫 💍 🎩 🧸 🛒`, "packName": "Party", "price": "16000", "type": "silver"},
	{"index": 7, "packEmoji": `🥈 🥇 🎰 💣 🕹 🎮 🔮 📍 🏹 🎶 📻`, "packName": "Games", "price": "32000", "type": "silver"},
	{"index": 8, "packEmoji": `🌑 🌕 🎴 🛑 ☄ ⚡ 🌸 🏮 💠 🐲 ⛩`, "packName": "Japan", "price": "200", "type": "gold"},
	{"index": 9, "packEmoji": `🌑 🌕 ☀️ ⭐ 🌟 🌠 🌀 ☄️ 💫 ⚡ ✨`, "packName": "Infinity", "price": "400", "type": "gold"}
];

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;

		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

		invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
			});
			//сохранение документа
			inv.save();
		}
		userEmoji = invData.invEmoji;

		var storeEmbedPage1 = new Discord.MessageEmbed()
		.setColor("#147cb8")
		.setTitle("⸝⸝ ♡₊˚ Магазин эмоджи◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		for (let i = 0; i < 8; i++) {
			storeEmbedPage1.addField(`Индекс`, "`" + `${emojiShop[i].index}` + "`", inline = true);
			storeEmbedPage1.addField(`Пак: ${emojiShop[i].packName}`, `${emojiShop[i].packEmoji}`, inline = true);
			if (userEmoji.find(x => x.index === emojiShop[i].index)) {
				storeEmbedPage1.addField(`Цена`, `Куплено!`, inline = true);
			} else {
				if (emojiShop[i].type == "gold") {
					storeEmbedPage1.addField(`Цена`, `${emojiShop[i].price} ${config.goldCoin}`, inline = true);
				} else {
					storeEmbedPage1.addField(`Цена`, `${emojiShop[i].price} ${config.silverCoin}`, inline = true);
				}
			}
		}

		var storeEmbedPage2 = new Discord.MessageEmbed()
		.setColor("#147cb8")
		.setTitle("⸝⸝ ♡₊˚ Магазин эмоджи◞")
		.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setTimestamp();

		for (let i = 8; i < 9; i++) {
			storeEmbedPage2.addField(`Индекс`, "`" + `${emojiShop[i].index}` + "`", inline = true);
			storeEmbedPage2.addField(`Пак: ${emojiShop[i].packName}`, `${emojiShop[i].packEmoji}`, inline = true);
			if (userEmoji.find(x => x.index === emojiShop[i].index)) {
				storeEmbedPage2.addField(`Цена`, `Куплено!`, inline = true);
			} else {
				if (emojiShop[i].type == "gold") {
					storeEmbedPage2.addField(`Цена`, `${emojiShop[i].price} ${config.goldCoin}`, inline = true);
				} else {
					storeEmbedPage2.addField(`Цена`, `${emojiShop[i].price} ${config.silverCoin}`, inline = true);
				}
			}
		}


		const pages = [
			storeEmbedPage1,
			storeEmbedPage2
		];
		const emoji = ["⏪", "⏩"];
		const timeout = '45000';
		pagination(message, pages, emoji, timeout);

	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "emojishop",
	alias: "es"
};