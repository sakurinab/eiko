const Discord = require('discord.js');
const fs = require('fs');
const isImageURL = require('image-url-validator').default;
const config = require("../botconfig.json");
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const vctimeModel = require('../schemas/vctimeSchema.js');
const warnModel = require('../schemas/warnSchema.js');
const invModel = require('../schemas/inventorySchema.js');
const actionModel = require('../schemas/actionSchema.js');
const reclanModel = require('../schemas/reclanSchema.js');

function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

function isHexColor(h) {
	var a = parseInt(h, 16);
	return (a.toString(16) === h)
}

module.exports.run = async (bot, message, args) => {
	try {
		//Цены
		const bannerCost = 2000;
		const lineCost = 800;
		const statusCost = 200;

		let rUser = message.author;
		let uid = message.author.id;
		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${message.author}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }
		let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
		if (mUser) {
			rUser = mUser.user;
			uid = mUser.user.id;
		}

		profileData = await profileModel.findOne({
			userID: uid
		});
		let userCoins = profileData.silverCoins;
		let userGoldCoins = profileData.goldCoins;
		let userPStatus = profileData.profileStatus;
		let userPBanner = profileData.profileBanner;
		let userPLine = profileData.profileLine;
		let userRep = profileData.reputation;
		let userMsgs = profileData.msgs;
		let userXP = profileData.xp;
		let userLvl = profileData.lvl;
		let userAchievements = profileData.achievements;
		let userClan = "Нет"
		if (profileData.clan != undefined) {
			if (profileData.clan != -1) {
				reclanData = await reclanModel.findOne({
					clanID: profileData.clan,
				})
				userClan = reclanData.name;
			}
		}
		let userMarriage = profileData.marriage;
		if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) {
			userMarriage = bot.users.cache.get(userMarriage).tag;
		}

		vctimeData = await vctimeModel.findOne({
			userID: uid
		});
		let userVCTime = vctimeData.vctime;

		let userWarns = 0;
		warnData = await warnModel.findOne({
			userID: uid
		});
		if (warnData) {
			userWarns = warnData.warnsNumber;
		}

		let errorCoins = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Недостаточно серебра.\nВаш баланс: ${userCoins} ${config.silverCoin}`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buyErr = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Ошибка покупки.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buySuccess = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Профиль◞")
			.setDescription(`Покупка совершена!`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buyCancel = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Профиль◞")
			.setDescription(`Покупка отменена.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		if (!args[0] || mUser) {
			const seconds = Math.floor((userVCTime / 1000) % 60);
			const minutes = Math.floor((userVCTime / 1000 / 60) % 60);
			const hours = Math.floor((userVCTime / 1000 / 60 / 60) % 24);
			const days = Math.floor(userVCTime / 1000 / 60 / 60 / 24);

			invData = await invModel.findOne({
				userID: uid
			});
			eqEmoji = 0;
			userEmoji = "";
			if (!invData) {
				inv = await invModel.create({
					userID: uid,
					eqEmoji: 0
				});
				//сохранение документа
				inv.save();
			} else {
				eqEmoji = invData.eqEmoji;
				userEmoji = invData.invEmoji;
			}

			if (eqEmoji > 0) {
				emojiList = userEmoji.find(x => x.index == eqEmoji).emojis;

				let [silverE, goldE, chatE, warnsE, xpE, lvlE, repE, marE, clanE, voiceE, achievE] = emojiList.split(" ");


				let profileembed = new Discord.MessageEmbed()
					.setColor(`${userPLine}`)
					.setTitle(`⸝⸝ ♡₊˚ Профиль◞`)
					.setDescription(`${userPStatus}`)
					.addField(`${silverE} Серебро`, '```' + userCoins + '```', inline = true)
					.addField(`${goldE} Золото`, '```' + userGoldCoins + '```', inline = true)
					.addField(`${chatE} Чат актив`, '```' + userMsgs + '```', inline = true)
					.addField(`${warnsE} Варны`, '```' + userWarns + '```', inline = true)
					.addField(`${xpE} Опыт`, '```' + userXP + `/` + 100 * userLvl + '```', inline = true)
					.addField(`${lvlE} Уровень`, '```' + userLvl + '```', inline = true)
					.addField(`${repE} Репутация`, '```' + userRep + '```', inline = false)
					.addField(`${marE} Брак`, '```' + userMarriage + '```', inline = true)
					.addField(`${clanE} Клан`, '```' + userClan + '```', inline = true)
					.addField(`${voiceE} Войс актив`, '```' + `${days}д. ${hours}ч. ${minutes}м. ${seconds}с.` + '```', inline = false)
					.addField(`${achievE} Знаки отличия`, '```' + userAchievements + '```', inline = false)
					.setThumbnail(`${rUser.displayAvatarURL({dynamic: true, size: 2048})}`)
					.setImage(`${userPBanner}`)
					.setTimestamp(message.createdAt)
					.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`);

				message.channel.send(profileembed);
			} else {
				let profileembed = new Discord.MessageEmbed()
					.setColor(`${userPLine}`)
					.setTitle(`⸝⸝ ♡₊˚ Профиль◞`)
					.setDescription(`${userPStatus}`)
					.addField(`Серебро`, '```' + userCoins + '```', inline = true)
					.addField(`Золото`, '```' + userGoldCoins + '```', inline = true)
					.addField("Чат актив", '```' + userMsgs + '```', inline = true)
					.addField("Варны", '```' + userWarns + '```', inline = true)
					.addField("Опыт", '```' + userXP + `/` + 100 * userLvl + '```', inline = true)
					.addField("Уровень", '```' + userLvl + '```', inline = true)
					.addField("Репутация", '```' + userRep + '```', inline = false)
					.addField("Брак", '```' + userMarriage + '```', inline = true)
					.addField("Клан", '```' + userClan + '```', inline = true)
					.addField("Войс актив", '```' + `${days}д. ${hours}ч. ${minutes}м. ${seconds}с.` + '```', inline = false)
					.addField("Знаки отличия", '```' + userAchievements + '```', inline = false)
					.setThumbnail(`${rUser.displayAvatarURL({dynamic: true, size: 2048})}`)
					.setImage(`${userPBanner}`)
					.setTimestamp(message.createdAt)
					.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`);

				message.channel.send(profileembed);
			}


		} else if (args[0] == "banner") {
			if (userCoins >= bannerCost) {
				let buyBannerEmbed = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Профиль◞")
					.setDescription(`Теперь отправьте баннер, который Вы хотите установить.\n❕\`Рекомендуемый размер баннера: 540x300 и более.\``)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				let noAttachment = new Discord.MessageEmbed()
					.setColor(config.errColor)
					.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
					.setDescription(`Вы забыли отправить картинку баннера.`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();

				let filter = m => m.author.id === message.author.id;
				let msgf = message.channel.send(buyBannerEmbed).then(() => {
					message.channel.awaitMessages(filter, {
							max: 1,
							time: 60000,
							errors: ['time']
						})
						.then(async message => {
							message = message.first();
							if (message.attachments.size > 0) {
								message.attachments.forEach(async Attachment => {
									//console debug
									console.info(Attachment.url);

									let newBannerURL = Attachment.url;

									let confBanner = new Discord.MessageEmbed()
										.setColor(`${config.defaultColor}`)
										.setTitle("⸝⸝ ♡₊˚ Профиль◞")
										.setDescription(`Вы уверены, что хотите установить баннер? Стоимость ${bannerCost} ${config.silverCoin}\nВаш баланс: ${userCoins} ${config.silverCoin}`)
										.setImage(newBannerURL)
										.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
										.setTimestamp();

									const msg = await message.channel.send(confBanner);
									await msg.react("✅");
									await msg.react("❌");
									await msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
											max: 1,
											time: 60000
										})
										.then(async collected => {
											msg.reactions.removeAll();

											if (collected.first().emoji.name == "✅") {
												profileData = await profileModel.updateOne({
													userID: uid,
												}, {
													profileBanner: newBannerURL,
												});

												let profileBanner = new Discord.MessageEmbed()
													.setColor(`${config.defaultColor}`)
													.setTitle("⸝⸝ ♡₊˚ Профиль◞")
													.setDescription(`Баннер вашего профиля:`)
													.setImage(`${newBannerURL}`)
													.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
													.setTimestamp();
												message.channel.send(profileBanner);
												profileData = await profileModel.updateOne({
													userID: uid,
												}, {
													$inc: {
														silverCoins: -bannerCost
													}
												});

												return;
											} else if (collected.first().emoji.name == "❌") {
												msg.edit(cancel);
												return;
											} else {
												return console.log("Ошибка реакции");
											}
										}).catch(async () => {
											msg.edit(cancel);
											return;
										});

								})
							} else {
								msg.edit(noAttachment);
							}
						})
						.catch((collected) => {
							message.channel.send(noAttachment);
							console.log(collected);
						});
				})
			} else {
				message.channel.send(errorCoins);
			}
		} else if (args[0] == "status") {
			if (userCoins >= statusCost) {
				let statusInvalid = new Discord.MessageEmbed()
					.setColor(`${config.errColor}`)
					.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
					.setDescription(`Статус не может быть больше 512 символов или менее 1`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				if (args.slice(1).join(' ').length > 512 || args.slice(1).join(' ').length < 1) return message.channel.send(statusInvalid);
				let buyStatusEmbed = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Профиль◞")
					.setDescription(`Вы уверены, что хотите установить статус "${args.slice(1).join(' ')}"? Стоимость ${statusCost} ${config.silverCoin}\nВаш баланс: ${userCoins} ${config.silverCoin}`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				let statusMsg = await message.channel.send(buyStatusEmbed);
				await statusMsg.react("✅");
				await statusMsg.react("❌");
				await statusMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 20000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "✅") {
							statusMsg.reactions.removeAll();
							statusMsg.edit(buySuccess);

							if (!args[1]) {
								let errorStatus = new Discord.MessageEmbed()
									.setColor(`${config.errColor}`)
									.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
									.setDescription(`Укажите свой статус.`)
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(errorStatus);
								statusMsg.edit(buyErr);
								return;
							} else {
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									profileStatus: args.slice(1).join(' '),
								});
								let profileStatus = new Discord.MessageEmbed()
									.setColor(`${config.defaultColor}`)
									.setTitle("⸝⸝ ♡₊˚ Профиль◞")
									.setDescription(`Ваш статус: ` + args.slice(1).join(' '))
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(profileStatus);
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									$inc: {
										silverCoins: -statusCost
									}
								});
								return;
							}
							return;
						} else if (collected.first().emoji.name == "❌") {
							statusMsg.reactions.removeAll();
							statusMsg.edit(buyCancel);
							return;
						} else {
							return statusMsg.edit(buyErr);
						}
					}).catch(async () => {
						statusMsg.edit(buyCancel);
						statusMsg.reactions.removeAll();
						return;
					});
			} else {
				message.channel.send(errorCoins);
			}
		} else if (args[0] == "line") {
			if (userCoins >= lineCost) {
				let buyLineEmbed = new Discord.MessageEmbed()
					.setColor(`${args.slice(1).join(' ')}`)
					.setTitle("⸝⸝ ♡₊˚ Профиль◞")
					.setDescription(`Вы уверены, что хотите установить цвет линии "${args.slice(1).join(' ')}"? Стоимость ${lineCost} ${config.silverCoin}\nВаш баланс: ${userCoins} ${config.silverCoin}`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				let lineMsg = await message.channel.send(buyLineEmbed);
				await lineMsg.react("✅");
				await lineMsg.react("❌");
				await lineMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 20000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "✅") {
							lineMsg.reactions.removeAll();
							lineMsg.edit(buySuccess);

							if (!args[1] || isHexColor(args.slice(1).join(' '))) {
								let errorLine = new Discord.MessageEmbed()
									.setColor(`${config.errColor}`)
									.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
									.setDescription(`Укажите HEX код линии.`)
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(errorLine);

								statusMsg.edit(buyErr);
								return;
							} else {
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									profileLine: args.slice(1).join(' '),
								});

								let profileLine = new Discord.MessageEmbed()
									.setColor(args.slice(1).join(' '))
									.setTitle("⸝⸝ ♡₊˚ Профиль◞")
									.setDescription(`Цвет вашей линии: ` + args.slice(1).join(' '))
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(profileLine);
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									$inc: {
										silverCoins: -lineCost
									}
								});
								return;
							}
							return;
						} else if (collected.first().emoji.name == "❌") {
							lineMsg.reactions.removeAll();
							lineMsg.edit(buyCancel);
							return;
						} else {
							return lineMsg.edit(buyErr);
						}
					}).catch(async () => {
						lineMsg.edit(buyCancel);
						lineMsg.reactions.removeAll();
						return;
					});
			} else {
				message.channel.send(errorCoins);
			}
		} else {
			let allCommands = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Команды профиля◞")
				.setDescription(`**.profile banner** - установить баннер профиля за ${bannerCost} ${config.silverCoin}\n\n**.profile status <ваш статус>** - установить статус в профиле за ${statusCost} ${config.silverCoin}\n> Пример: ` + '`' + '.p status Привет, это мой статус!' + '`' + `\n\n**.profile line <#HEX>** - указать цвет линии профиля за ${lineCost} ${config.silverCoin}\n> Пример: ` + '`' + '.p line #5b2076' + '`' + `\n\n**.profile help** - данное сообщение.`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			message.channel.send(allCommands);
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "profile",
	alias: "p"
};