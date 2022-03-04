//  _____  _                 _____              _                           
// /  __ \| |               /  ___|            | |                          
// | /  \/| |  __ _  _ __   \ `--.  _   _  ___ | |_  ___  _ __ ___          
// | |    | | / _` || '_ \   `--. \| | | |/ __|| __|/ _ \| '_ ` _ \         
// | \__/\| || (_| || | | | /\__/ /| |_| |\__ \| |_|  __/| | | | | |        
//  \____/|_| \__,_||_| |_| \____/  \__, ||___/ \__|\___||_| |_| |_|        
//                                   __/ |                                  
// ______          _   __       _   |___/                 _                 
// | ___ \        | | / /      (_)     | |               | |                
// | |_/ / _   _  | |/ /  _ __  _  ___ | |_  ___   _ __  | |__    ___  _ __ 
// | ___ \| | | | |    \ | '__|| |/ __|| __|/ _ \ | '_ \ | '_ \  / _ \| '__|
// | |_/ /| |_| | | |\  \| |   | |\__ \| |_| (_) || |_) || | | ||  __/| |   
// \____/  \__, | \_| \_/|_|   |_||___/ \__|\___/ | .__/ |_| |_| \___||_|   
//          __/ |                                 | |                       
//         |___/      _____       _____           |_|                       
//         /  |      |____ |     |  _  |                                    
// __   __ `| |          / /     | |/' |                                    
// \ \ / /  | |          \ \     |  /| |                                    
//  \ V /  _| |_  _  .___/ /  _  \ |_/ /                                    
//   \_/   \___/ (_) \____/  (_)  \___/                                     
//
const Discord = require('discord.js');
const fs = require('fs');
const isImageURL = require('image-url-validator').default;
const config = require("../botconfig.json");
//mongoose
const mongoose = require('mongoose');
const reclanModel = require('../schemas/reclanSchema.js');
const profileModel = require('../schemas/profileSchema.js');
const deposeModel = require('../schemas/clanDepositSchema.js');
const actionModel = require('../schemas/actionSchema.js');
//TEMPSHIT
const reclanCategory = "829371033785991210";
const clanDefaultDesc = "Описание нашего клана..."
//Multipliers
const xplvlmult = 4320;
//Prices
const clanPrice = 50000;
const deposeCooldown = 43200000; //ms
const clanDepositLimit = 15000;
const colorPrice = 5000;
const descriptionPrice = 5000;
const symbolPrice = 15000;
const bannerPrice = 30000;
const renamePrice = 10000;
const bombPrice = 800;
const bombCooldown = 1000 * 60 * 60 * 4;
const robPrice = 300;
const robCooldown = 1000 * 60 * 60 * 2;
//perks start prices
const slotsPrice = 60000;
const levelMultiplyPrice = 70000;
const coinMultiplyPrice = 100000;

function isHexColor(h) {
	if (h.match(/^#([0-9A-F]{3}){1,2}$/i) || h.match(/^#[0-9A-F]{6}$/i)) return true
	return false;
}

module.exports.run = async (bot, message, args) => {
	try {

		let author = message.author;
		let userSilver = profileData.silverCoins;
		let target = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));

		profileData = await profileModel.findOne({
			userID: author.id,
		})
		let userClan = profileData.clan;

		let reclanData = [];

		let coinBoost = coinMultiplyPrice;
		let lvlBoost = levelMultiplyPrice;
		let slotsBoost = slotsPrice;
		let membersAmount = 0;

		if (userClan != -1) {
			reclanData = await reclanModel.findOne({
				clanID: userClan,
			});
			//perks multiplied prices
			coinBoost = reclanData.coinMultiply * coinMultiplyPrice;
			lvlBoost = reclanData.lvlMultiply * levelMultiplyPrice;
			slotsBoost = Math.floor(reclanData.slots / 10) * slotsPrice;

			membersAmount = reclanData.members.length + reclanData.officers.length;
		}

		//INFO

		let systemInfo = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Система◞")
			.setDescription(`Информация о системе кланов:`)
			.addField(`Автор: `, '```' + `Kristopher` + '```', inline = true)
			.addField(`Версия: `, '```' + `1.3.0` + '```', inline = true)
			.addField(`Обновлено: `, '```' + `16.06.2021` + '```', inline = true)
			.addField(`Сервер: `, '```' + `Teiko.` + '```', inline = true)
			.setFooter(`© Teiko. 🍃 by. bulokys.`)
			.setTimestamp();

		//Эмбеды
		let invalidName = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Имя клана указано неверно.\nИмя клана не может быть меньше 3 или больше 48 символов.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youAreInClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Для того, чтобы создать свой клан - покиньте текущий.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let cancel = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle("⸝⸝ ♡₊˚ Кланы◞")
			.setDescription(`Действие было отменено.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youAreNotInClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`К сожалению, Вы не состоите в клане, чтобы сделать это.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let clanIsUnderAttack = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не можете сделать это, пока Ваш клан атакуют.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let noOwnClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не являетесь владельцем клана.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let noPermissions = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не являетесь владельцем или офицером клана.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let urself = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не можете сделать это на себе.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let noTarget = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Пользователь не указан.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let userInClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Пользователь уже находится в клане.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let noSlots = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`В клане нет свободных мест.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let userNotInYourClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Пользователь не является участником Вашего клана.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youCantKickOfficer = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не можете выгнать офицера клана.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youCantLeaveYourClan = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не можете покинуть *свой* клан. Вам нужно *удалить* его или *передать* другому пользователю клана.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let errorCoins = new Discord.MessageEmbed()
			.setColor(config.errColor)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Недостаточно серебра.\nВаш баланс: ${userSilver} ${config.silverCoin}`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let invalidHex = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Неверно указан цвет.\nПример цвета: \`#5b2076\``)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let noClanBalance = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`На балансе клана не хватает денег.\nБаланс клана: ${reclanData.balance}`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youCantSetBannerNow = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Баннер доступен только со **второго** уровня клана.\nУровень клана: **${reclanData.level}**`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youCantUpgradeClan = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Улучшения доступны с **третьего** уровня клана.\nУровень клана: **${reclanData.level}**`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youHaveAMaxAmmountOfSlots = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`У Вас максимальное количество слотов в клане.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youCantAttackYourClan = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы не можете атаковать свой клан.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let youForgotToSpecifyID = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Вы забыли указать ID клана, который хотите атаковать.`)
			.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		if (!args[0]) {
			if (userClan == -1) return message.channel.send(youAreNotInClan);

			let clanColor = message.guild.roles.cache.get(reclanData.roleID).color;

			let dateStamp = new Date(reclanData.creationDate),
				createDate = [dateStamp.getDate(),
					dateStamp.getMonth() + 1,
					dateStamp.getFullYear()
				].join('/') + ' ' + [dateStamp.getHours(),
					dateStamp.getMinutes()
				].join(':');

			let memberAmount = reclanData.members.length + reclanData.officers.length;

			let membersDividedTwo = 1;
			if (Math.floor(memberAmount / 2) > 0) {
				clanxpmult = Math.floor(memberAmount / 2);
			}

			let membersField = "Нет";
			if (reclanData.members.length > 0) {
				membersField = "";
				reclanData.members.slice(-7).forEach(async user => {
					membersField += `<@${user.memberID}>\n`
				})
				if ((reclanData.members.length - 7) > 0) {
					membersField += `И ${reclanData.members.length-7} ещё...`
				}
			}

			let officersField = "Нет";
			if (reclanData.officers.length > 0) {
				officersField = "";
				reclanData.officers.slice(-7).forEach(async user => {
					officersField += `<@${user.memberID}>\n`
				})
				if ((reclanData.officers.length - 7) > 0) {
					officersField += `И ${reclanData.officers.length-7} ещё...`
				}
			}

			let isBanner = "Да";
			if (reclanData.bannerLink == "" || reclanData.bannerLink == " " || reclanData.bannerLink == null) {
				isBanner = "Нет";
			}

			let coinBoost = reclanData.coinMultiply;
			let lvlBoost = reclanData.lvlMultiply;
			let clanXPNeed = xplvlmult * reclanData.level * membersDividedTwo;

			var clanDataEmbed = new Discord.MessageEmbed()
				.setColor(clanColor)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setDescription(`**⸝⸝ ♡₊˚ Клан : <@&${reclanData.roleID}> ${reclanData.symbols}◞**\n${reclanData.description}`)
				.addField(`👤 В клане`, '```' + `${memberAmount}/${reclanData.slots}` + '```', inline = true)
				.addField(`🏆 Трофеи`, '```' + `${reclanData.prize}` + '```', inlite = true)
				.addField(`📆 Дата основания`, '```' + `${createDate}` + '```', inline = true)
				.addField(`🌟 Уровень`, '```' + `${reclanData.level}` + '```', inline = true)
				.addField(`⭐ Опыт`, '```' + `${reclanData.xp}/${clanXPNeed}` + '```', inline = true)
				.addField(`${config.silverCoin} Баланс`, '```' + `${reclanData.balance}` + '```', inlite = true)
				.addField(`☄️ Буст серебра`, '```' + `x${reclanData.coinMultiply}` + '```', inlite = true)
				.addField(`🎴 Баннер`, '```' + `${isBanner}` + '```', inlite = true)
				.addField(`🔮 Буст уровня`, '```' + `x${reclanData.lvlMultiply}` + '```', inlite = true)
				.addField(`୨୧ ・ Основатель:`, `<@${reclanData.ownerID}>`, inline = true)
				.addField(`୨୧ ・ Офицеры:`, `${officersField}`, inline = true)
				.addField(`୨୧ ・ Участники:`, `${membersField}`, inline = true)
				.setTimestamp();

			if (!(reclanData.bannerLink == "" || reclanData.bannerLink == " " || reclanData.bannerLink == null)) {
				clanDataEmbed.setImage(reclanData.bannerLink);
			}

			message.channel.send(clanDataEmbed);
		} else if (args[0] == "create") {
			//Оставить в имени только буквы и цифры
			let newClanName = args.slice(1).join(' ').replace(/[^a-zа-яA-ZА-Я0-9 ]/g, "").replace(/\s+/g, ' ').trim();
			if (!newClanName || newClanName.length > 48 || newClanName.length < 3) return message.channel.send(invalidName);
			let clanAlreadyExist = new Discord.MessageEmbed()
				.setColor(config.errColor)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Клан '${newClanName}' уже существует. Попробуйте придумать другое имя.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			//Проверить состоит ли пользователь в клане
			if (userClan != -1) return message.channel.send(youAreInClan);
			//Проверить баланс пользователя
			if (userSilver < clanPrice) return message.channel.send(errorCoins);
			//Проверка имени клана
			if (newClanName == "create" || newClanName == "delete" || newClanName == "invite" || newClanName == "kick" || newClanName == "leave" || newClanName == "officer" || newClanName == "dep" || newClanName == "deposit" || newClanName == "color" || newClanName == "rename" || newClanName == "desc" || newClanName == "description" || newClanName == "symb" || newClanName == "symbol" || newClanName == "banner" || newClanName == "perks" || newClanName == "perk" || newClanName == "upgrade" || newClanName == "version" || newClanName == "bomb" || newClanName == "rob" || newClanName == "bomb" || newClanName == "top" || newClanName == "help") return message.channel.send(invalidName);
			reclanData = await reclanModel.findOne({
				name: newClanName
			});
			if (reclanData) return message.channel.send(clanAlreadyExist);

			let confCreateClan = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите создать клан '${newClanName}' за ${clanPrice} ${config.silverCoin}?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			//Подтверждение действия
			const msg = await message.channel.send(confCreateClan);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan != -1) return msg.edit(youAreInClan);
						//Найти ID последнего клана
						let reclanID = 0;
						docs = await reclanModel.find().estimatedDocumentCount();
						if (docs != 0) {
							res = await reclanModel.find().sort({clanID:-1}).limit(1);
							reclanID = res[0].clanID;
						}
						//Добавить 1 к ID клана, чтобы создать новый ID
						reclanID++;

						reclanData = await reclanModel.create({
							clanID: reclanID,
							ownerID: author.id,
							creationDate: Date.now(),
							balance: 0,
							description: clanDefaultDesc,
							lvlMultiply: 1,
							coinMultiply: 1,
							name: newClanName,
							level: 1,
							xp: 0,
							prize: 0,
							slots: 10,
							lastBomb: 0,
							lastRob: 0,
							lastTrap: 0,
							underAttack: 0,
						});
						reclanData.save();

						//Создание роли клана
						message.guild.roles.create({
							data: {
								name: newClanName,
								position: 63,
							},
						}).then(async role => {
							message.member.roles.add(role);
							message.member.roles.add(config.clanLeaderRole);
							reclanData = await reclanModel.updateOne({
								clanID: reclanID
							}, {
								$set: {
									roleID: role.id
								}
							});
						}).catch(error => console.log(error));

						profileData = await profileModel.updateOne({
							userID: author.id,
						}, {
							$set: {
								clan: reclanID
							},
							$inc: {
								silverCoins: -clanPrice
							}
						});

						message.member.guild.channels.create(newClanName, {
							type: 'voice',
							userLimit: 10,
							parent: config.clanCategory,
							permissionOverwrites: [{
								id: author.id,
								allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
							}, {
								id: config.everyoneID,
								deny: ['CONNECT', 'SPEAK'],
							}, {
								id: config.nonverifiedUserRole,
								deny: ['VIEW_CHANNEL']
							}]
						}).then(async voice => {
							reclanData = await reclanModel.updateOne({
								clanID: reclanID,
							}, {
								$set: {
									voiceID: voice.id
								}
							});
							message.member.guild.channels.create(newClanName, {
								type: 'text',
								parent: config.clanCategory,
								permissionOverwrites: [{
									id: author.id,
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS']
								}, {
									id: config.everyoneID,
									deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
								}, {
									id: config.nonverifiedUserRole,
									deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
								}]
							}).then(async chat => {
								reclanData = await reclanModel.updateOne({
									clanID: reclanID,
								}, {
									$set: {
										chatID: chat.id
									}
								});
							})
						})

						let clanCreateSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Клан '${newClanName}' был успешно сформирован!\n\nВаш баланс: ${userSilver - clanPrice} ${config.silverCoin}`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(clanCreateSuccess);

						return;
					} else if (collected.first().emoji.name == "❌") {
						msg.edit(cancel);
						return;
					} else {
						return console.log("Ошибка реакции");
					}
				}).catch(async err => {
					msg.edit(cancel);
					console.warn(err);
					return;
				});
		} else if (args[0] == "delete") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);

			let confClanDelete = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите удалить свой клан <@&${reclanData.roleID}>?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confClanDelete);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						reclanDeleteResponce = await reclanModel.deleteOne({
							clanID: userClan
						});

						profileData = await profileModel.updateOne({
							userID: author.id,
						}, {
							$set: {
								clan: -1,
							}
						});

						if (reclanData.members.length > 0) {
							reclanData.members.forEach(async user => {
								profileData = await profileModel.updateOne({
									userID: user.memberID,
								}, {
									$set: {
										clan: -1
									}
								});
							})
						}

						if (reclanData.officers.length > 0) {
							reclanData.officers.forEach(async user => {
								profileData = await profileModel.updateOne({
									userID: user.memberID,
								}, {
									$set: {
										clan: -1
									}
								});
								//Снимать роль офицера
								bot.guilds.cache.get(config.serverId).members.cache.get(user.memberID).roles.remove(config.clanOfficerRole);
							})
						}

						//Снять роль клан лидера
						bot.guilds.cache.get(config.serverId).members.cache.get(reclanData.ownerID).roles.remove(config.clanLeaderRole);

						//Удалить роль клана
						bot.guilds.cache.get(config.serverId).roles.cache.get(reclanData.roleID).delete();

						//Удалить каналы клана
						bot.channels.cache.get(reclanData.chatID).delete();
						bot.channels.cache.get(reclanData.voiceID).delete();

						let deleteSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Клан '${reclanData.name}' был успешно удалён!`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(deleteSuccess);

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
		} else if (args[0] == "invite") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (membersAmount > reclanData.slots) return message.channel.send(noSlots);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером или офицером
			if (!(message.member.roles.cache.has(config.clanLeaderRole) || message.member.roles.cache.has(config.clanOfficerRole))) return message.channel.send(noPermissions);
			if (target.id == author.id) return message.channel.send(urself);
			if (target.user.bot || !target) return message.channel.send(noTarget);
			let targetData = await profileModel.findOne({
				userID: target.id,
			});
			if (targetData.clan != -1) return message.channel.send(userInClan);

			let clanInvite = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`${target}, Вы были приглашены в клан <@&${reclanData.roleID}>!`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(clanInvite);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						profileData = await profileModel.updateOne({
							userID: target.id,
						}, {
							$set: {
								clan: reclanData.clanID
							}
						});

						let newMember = {
							memberID: target.id
						};

						await reclanModel.updateOne({
							clanID: reclanData.clanID,
						}, {
							$push: {
								members: newMember,
							}
						});

						bot.channels.cache.get(voiceID).updateOverwrite(target.id, {
							CONNECT: true,
							SPEAK: true,
							VIEW_CHANNEL: true
						});
						bot.channels.cache.get(chatID).updateOverwrite(target.id, {
							VIEW_CHANNEL: true,
							SEND_MESSAGES: true,
							VIEW_CHANNEL: true,
							SEND_MESSAGES: true,
							READ_MESSAGE_HISTORY: true,
							ATTACH_FILES: true,
							EMBED_LINKS: true
						});
						target.roles.add(reclanData.roleID)
						//message.guild.members.cache.get(target.id).roles.add(reclanData.roleID);

						let clanInviteSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`${target}, теперь Вы участник клана <@&${reclanData.roleID}>!`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(clanInviteSuccess);

						return;
					} else if (collected.first().emoji.name == "❌") {
						let clanInviteCancel = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`${target} отказался вступать в клан <@&${reclanData.roleID}>`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(clanInviteCancel);
						return;
					} else {
						return console.log("Ошибка реакции");
					}
				}).catch(async () => {
					msg.edit(cancel);
					return;
				});
		} else if (args[0] == "kick") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером или офицером
			if (!(message.member.roles.cache.has(config.clanLeaderRole) || message.member.roles.cache.has(config.clanOfficerRole))) return message.channel.send(noPermissions);
			if (target.id == author.id) return message.channel.send(urself);
			if (target.user.bot || !target) return message.channel.send(noTarget);
			let targetData = await profileModel.findOne({
				userID: target.id,
			});
			if (targetData.clan != reclanData.clanID) return message.channel.send(userNotInYourClan);
			if (target.member.roles.cache.has(config.clanOfficerRole)) return message.channel.send(youCantKickOfficer)

			let confKick = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите выгнать ${target} из клана?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confKick);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						await profileModel.updateOne({
							userID: target.id,
						}, {
							$set: {
								clan: -1
							}
						});

						await reclanModel.updateOne({
							clanID: reclanData.clanID,
						}, {
							$pull: {
								members: {
									memberID: target.id
								}
							}
						});


						bot.channels.cache.get(clanVoice).permissionOverwrites.get(target.id).delete();
						bot.channels.cache.get(clanChat).permissionOverwrites.get(target.id).delete();

						message.guild.members.cache.get(target.id).roles.remove(reclanData.roleID);

						let userKickSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Пользователь ${target} был выгнан из клана <@&${reclanData.roleID}>`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(userKickSuccess);

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
		} else if (args[0] == "leave") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(youCantLeaveYourClan);

			let confKick = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите покинуть клан <@&${reclanData.roleID}>?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confKick);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						await profileModel.updateOne({
							userID: author.id,
						}, {
							$set: {
								clan: -1
							}
						});

						if (message.member.roles.cache.has(config.clanOfficerRole)) {
							await reclanModel.updateOne({
								clanID: reclanData.clanID,
							}, {
								$pull: {
									officers: {
										memberID: author.id
									}
								}
							});
							message.guild.members.cache.get(author.id).roles.remove(config.clanOfficerRole);
						} else {
							await reclanModel.updateOne({
								clanID: reclanData.clanID,
							}, {
								$pull: {
									members: {
										memberID: author.id
									}
								}
							});
						}


						bot.channels.cache.get(clanVoice).permissionOverwrites.get(author.id).delete();
						bot.channels.cache.get(clanChat).permissionOverwrites.get(author.id).delete();

						message.guild.members.cache.get(author.id).roles.remove(reclanData.roleID);

						let userLeaveSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Вы покинули клан <@&${reclanData.roleID}>`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(userLeaveSuccess);

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
		} else if (args[0] == "officer") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером или офицером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (target.id == author.id) return message.channel.send(urself);
			if (target.user.bot || !target) return message.channel.send(noTarget);
			let targetData = await profileModel.findOne({
				userID: target.id,
			});
			if (targetData.clan != reclanData.clanID) return message.channel.send(userNotInYourClan);

			let newMember = {
				memberID: target.id
			};

			if (target.member.roles.cache.has(config.clanOfficerRole)) {
				await reclanModel.updateOne({
					clanID: reclanData.clanID,
				}, {
					$pull: {
						officers: {
							memberID: target.id
						}
					},
					$push: {
						members: newMember
					}
				});

				let notOfficerAnymore = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Кланы◞")
					.setDescription(`${target} больше не является офицером клана.`)
					.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();

				message.channel.send(notOfficerAnymore);

				bot.guilds.cache.get(config.serverId).members.cache.get(target.id).roles.remove(config.clanOfficerRole);
			} else {
				await reclanModel.updateOne({
					clanID: reclanData.clanID,
				}, {
					$pull: {
						members: {
							memberID: target.id
						}
					},
					$push: {
						officers: newMember
					}
				});
				let isNowOfficer = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Кланы◞")
					.setDescription(`${target} теперь является офицером клана.`)
					.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();

				message.channel.send(isNowOfficer);

				bot.guilds.cache.get(config.serverId).members.cache.get(target.id).roles.add(config.clanOfficerRole);
			}
		} else if (args[0] == "dep" || args[0] == "deposit") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(noArgMoney);
			deposeData = await deposeModel.findOne({
				userID: author.id
			});
			if (!deposeData) {
				depose = await deposeModel.create({
					userID: author.id,
					deposed: 0,
					lastDepose: 0,
				});
				//сохранение документа
				depose.save();
			}
			let moneyToDeposit = parseInt(args[1]);
			if (userSilver < moneyToDeposit) return message.channel.send(errorCoins);
			deposeData = await deposeModel.findOne({
				userID: author.id
			});

			let timeOut = deposeCooldown - (Date.now() - deposeData.lastDepose);

			const seconds = Math.floor((timeOut / 1000) % 60);
			const minutes = Math.floor((timeOut / 1000 / 60) % 60);
			const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

			let timeoutDeposit = new Discord.MessageEmbed()
				.setColor(config.defaultColor)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уже вложили в клан ${clanDepositLimit} ${config.silverCoin} за последние 12 часов.\n\nДо следующего пополнения баланса клана: **${hours}ч. ${minutes}м. ${seconds}с.**`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			if (deposeData.deposed >= clanDepositLimit && (Date.now() - deposeData.lastDepose) < deposeCooldown) return message.channel.send(timeoutDeposit);

			if ((Date.now() - deposeData.lastDepose) > deposeCooldown) {
				deposeData.deposed = 0;
			}

			if ((deposeData.deposed + moneyToDeposit) > clanDepositLimit) {
				moneyToDeposit = clanDepositLimit - deposeData.deposed;
			}

			await reclanModel.updateOne({
				clanID: userClan,
			}, {
				$inc: {
					balance: moneyToDeposit
				}
			});

			await profileModel.updateOne({
				userID: author.id,
			}, {
				$inc: {
					silverCoins: -moneyToDeposit
				}
			});

			if ((Date.now() - deposeData.lastDepose) > deposeCooldown) {
				await deposeModel.updateOne({
					userID: author.id,
				}, {
					$set: {
						deposed: moneyToDeposit,
						lastDepose: Date.now()
					}
				});
			} else {
				await deposeModel.updateOne({
					userID: author.id,
				}, {
					$set: {
						lastDepose: Date.now()
					},
					$inc: {
						deposed: moneyToDeposit
					}
				});
			}

			let deposedEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы пополнили баланс клана на ${moneyToDeposit} ${config.silverCoin}\n\nВаш баланс: ${userSilver-moneyToDeposit} ${config.silverCoin}`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(deposedEmbed);
		} else if (args[0] == "color") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.balance < colorPrice) return message.channel.send(noClanBalance);
			let newColor = args[1];
			if (!newColor || !isHexColor(newColor)) return message.channel.send(invalidHex);

			let confColor = new Discord.MessageEmbed()
				.setColor(newColor)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите установить цвет клана на ${newColor}?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confColor);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						message.guild.roles.cache.get(reclanData.roleID).setColor(newColor);

						await reclanModel.updateOne({
							clanID: userClan,
						}, {
							$inc: {
								balance: -colorPrice
							}
						});

						let colorSuccess = new Discord.MessageEmbed()
							.setColor(newColor)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Новый цвет клана <@&${reclanData.roleID}> установлен.`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(colorSuccess);

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
		} else if (args[0] == "rename") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.balance < renamePrice) return message.channel.send(noClanBalance);
			let newName = args.slice(1).join(' ').replace(/[^a-zа-яA-ZА-Я0-9 ]/g, "").replace(/\s+/g, ' ').trim();

			let clanAlreadyExist = new Discord.MessageEmbed()
				.setColor(config.errColor)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Клан '${newName}' уже существует. Попробуйте придумать другое имя.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			isExist = await reclanModel.findOne({
				name: newName,
			});

			if (isExist) return message.channel.send(clanAlreadyExist);

			let confRename = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите поменять имя клана <@&${reclanData.roleID}> на \`${newName}\`?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confRename);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						await reclanModel.updateOne({
							clanID: reclanData.clanID,
						}, {
							$inc: {
								balance: -renamePrice
							},
							$set: {
								name: newName
							}
						});

						bot.channels.cache.get(reclanData.chatID).setName(newName);
						bot.channels.cache.get(reclanData.voiceID).setName(newName);
						message.guild.roles.cache.get(reclanData.roleID).setName(newName);

						let renameSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Имя клана было изменено на <@&${reclanData.roleID}>`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(renameSuccess);

						return;
					} else if (collected.first().emoji.name == "❌") {
						msg.edit(cancel);
						return;
					} else {
						return console.log("Ошибка реакции");
					}
				}).catch(async (err) => {
					msg.edit(cancel);
					console.log(err);
					return;
				});
		} else if (args[0] == "desc" || args[0] == "description") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.balance < descriptionPrice) return message.channel.send(noClanBalance);
			let newDescription = args.slice(1).join(' ');
			let descriptionInvalid = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Описание клана длиннее 512 символов.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (newDescription.length > 512) return message.channel.send(descriptionInvalid);
			let noDescription = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Описание клана отсутствует.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (newDescription.length < 1) return message.channel.send(noDescription);

			let confDesc = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите установить описание клана на: ${newDescription}?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confDesc);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						await reclanModel.updateOne({
							clanID: userClan,
						}, {
							$inc: {
								balance: -descriptionPrice
							},
							$set: {
								description: newDescription
							}
						});

						let descSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Описание клана установлено на: ${newDescription}`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(descSuccess);

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
		} else if (args[0] == "symb" || args[0] == "symbol") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.balance < symbolPrice) return message.channel.send(noClanBalance);
			let clanSymbol = args.slice(1).join(' ').replace(/[a-zA-Z0-9 `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
			let noSymbArg = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Вы забыли указать символ(ы) клана.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (!clanSymbol || clanSymbol.length <= 0 || clanSymbol.length > 8) return message.channel.send(noSymbArg);

			let confSymb = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы уверены, что хотите установить символ(ы) клана на: ${clanSymbol}?`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			const msg = await message.channel.send(confSymb);
			await msg.react("✅");
			await msg.react("❌");
			await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
					max: 1,
					time: 60000
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "✅") {
						if (userClan == -1) return msg.edit(youAreNotInClan);

						await reclanModel.updateOne({
							clanID: userClan,
						}, {
							$inc: {
								balance: -symbolPrice
							},
							$set: {
								symbols: clanSymbol
							}
						});

						let symbSuccess = new Discord.MessageEmbed()
							.setColor(`${config.defaultColor}`)
							.setTitle("⸝⸝ ♡₊˚ Кланы◞")
							.setDescription(`Символ(ы) клана были установлены на: ${clanSymbol}`)
							.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
							.setTimestamp();

						msg.edit(symbSuccess);

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
		} else if (args[0] == "banner") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.balance < bannerPrice) return message.channel.send(noClanBalance);
			if (reclanData.level < 2) return message.channel.send(youCantSetBannerNow);

			let waitingForABanner = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Теперь отправьте баннер, который Вы хотите установить.\n❕\`Рекомендуемый размер баннера: 540x200 и более.\``)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			let noAttachment = new Discord.MessageEmbed()
				.setColor(config.errColor)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Вы забыли отправить картинку баннера.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			let filter = m => m.author.id === message.author.id;
			let msgf = message.channel.send(waitingForABanner).then(() => {
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
									.setTitle("⸝⸝ ♡₊˚ Кланы◞")
									.setDescription(`Вы уверены, что хотите установить данный баннер клана?`)
									.setImage(newBannerURL)
									.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();

								const msg = await message.channel.send(confBanner);
								await msg.react("✅");
								await msg.react("❌");
								await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
										max: 1,
										time: 60000
									})
									.then(async collected => {
										msg.reactions.removeAll();

										if (collected.first().emoji.name == "✅") {
											if (userClan == -1) return msg.edit(youAreNotInClan);

											await reclanModel.updateOne({
												clanID: userClan,
											}, {
												$inc: {
													balance: -bannerPrice
												},
												$set: {
													bannerLink: newBannerURL
												}
											});

											let bannerSuccess = new Discord.MessageEmbed()
												.setColor(`${config.defaultColor}`)
												.setTitle("⸝⸝ ♡₊˚ Кланы◞")
												.setDescription(`Баннер клана был успешно установлен.`)
												.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
												.setTimestamp();

											msg.edit(bannerSuccess);

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
		} else if (args[0] == "perks" || args[0] == "perk") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);

			let perksEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.addField(`\u200b`, '**────── Буст серебра +100% ──────**', inline = false)
				.addField(`Индекс`, '`1`', inline = true)
				.addField(`Описание`, `Увеличивает количество получаемого серебра для участников клана в N раз.`, inline = true)
				.addField(`Цена`, `${coinBoost} ${config.silverCoin}`, inline = true)
				.addField(`\u200b`, '**─────── Буст опыта +100% ───────**', inline = false)
				.addField(`Индекс`, '`2`', inline = true)
				.addField(`Описание`, `Увеличивает количество получаемого опыта для участников клана в N раз.`, inline = true)
				.addField(`Цена`, `${lvlBoost} ${config.silverCoin}`, inline = true)
				.addField(`\u200b`, '**────── Дополнительные слоты ─────**', inline = false)
				.addField(`Индекс`, '`3`', inline = true)
				.addField(`Описание`, `Увеличивает общее количество слотов в клане на 5.`, inline = true)
				.addField(`Цена`, `${slotsBoost} ${config.silverCoin}`, inline = true)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(perksEmbed);
		} else if (args[0] == "upgrade") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			if (reclanData.underAttack == true) return message.channel.send(clanIsUnderAttack);
			//проверить является пользователь овнером
			if (!message.member.roles.cache.has(config.clanLeaderRole)) return message.channel.send(noOwnClan);
			if (reclanData.level < 3) return message.channel.send(youCantUpgradeClan);

			let noIndexUp = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Индекс улучшения не указан.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(noIndexUp);
			let index = args[1];
			let invalidIndexUp = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Индекс улучшения не может быть больше 3`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			if (index > 3) return message.channel.send(invalidIndexUp);
			if (index == 1) {
				if (reclanData.balance < coinBoost) return message.channel.send(noClanBalance);
				let confCoinBoost = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Кланы◞")
					.setDescription(`Вы уверены, что хотите улучшить буст серебра до уровня ${reclanData.coinMultiply+1}?`)
					.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				const msg = await message.channel.send(confCoinBoost);
				await msg.react("✅");
				await msg.react("❌");
				await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 30000
					})
					.then(async collected => {
						msg.reactions.removeAll();

						if (collected.first().emoji.name == "✅") {
							if (userClan == -1) return msg.edit(youAreNotInClan);
							await reclanModel.updateOne({
								clanID: userClan,
							}, {
								$inc: {
									coinMultiply: 1,
									balance: -coinBoost
								}
							});

							let coinBoostSuccess = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Кланы◞")
								.setDescription(`Буст серебра был улучшен до уровня ${reclanData.coinMultiply+1}.`)
								.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
								.setTimestamp();

							msg.edit(coinBoostSuccess);
							return;
						} else if (collected.first().emoji.name == "❌") {
							msg.edit(cancel);
							return;
						} else {
							return console.log("Ошибка реакции");
						}
					}).catch(async err => {
						msg.edit(cancel);
						return;
					});
			} else if (index == 2) {
				if (reclanData.balance < lvlBoost) return message.channel.send(noClanBalance);
				let confLevelBoost = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Кланы◞")
					.setDescription(`Вы уверены, что хотите улучшить буст опыта до уровня ${reclanData.lvlMultiply+1}?`)
					.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				const msg = await message.channel.send(confLevelBoost);
				await msg.react("✅");
				await msg.react("❌");
				await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 30000
					})
					.then(async collected => {
						msg.reactions.removeAll();

						if (collected.first().emoji.name == "✅") {
							msg.reactions.removeAll();
							if (userClan == -1) return msg.edit(youAreNotInClan);

							await reclanModel.updateOne({
								clanID: userClan,
							}, {
								$inc: {
									lvlMultiply: 1,
									balance: -lvlBoost
								}
							});

							let levelBoostSuccess = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Кланы◞")
								.setDescription(`Буст опыта был улучшен до уровня ${reclanData.lvlMultiply+1}.`)
								.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
								.setTimestamp();

							msg.edit(levelBoostSuccess);
							return;
						} else if (collected.first().emoji.name == "❌") {
							msg.edit(cancel);
							return;
						} else {
							return console.log("Ошибка реакции");
						}
					}).catch(async err => {
						msg.edit(cancel);
						return;
					});
			} else if (index == 3) {
				if (reclanData.balance < slotsBoost) return message.channel.send(noClanBalance);
				if (reclanData.slots > 95) return message.channel.send(youHaveAMaxAmmountOfSlots)
				let confSlots = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Кланы◞")
					.setDescription(`Вы уверены, что хотите купить дополнительные 5 слотов в клан?`)
					.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				const msg = await message.channel.send(confSlots);
				await msg.react("✅");
				await msg.react("❌");
				await msg.awaitReactions((reaction, user) => user.id == author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 30000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "✅") {
							msg.reactions.removeAll();
							if (userClan == -1) return msg.edit(youAreNotInClan);

							await reclanModel.updateOne({
								clanID: userClan,
							}, {
								$inc: {
									slots: 5,
									balance: -slotsBoost
								}
							});

							let newVoiceLimit = reclanData.slots + 5;
							bot.channels.cache.get(reclanData.voiceID).setUserLimit(newVoiceLimit);

							let slotsSuccess = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Кланы◞")
								.setDescription(`Были куплены новые 5 слотов в клан. Теперь в клане ${newVoiceLimit} мест.`)
								.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
								.setTimestamp();

							msg.edit(slotsSuccess);
							return;
						} else if (collected.first().emoji.name == "❌") {
							msg.edit(cancel);
							return;
						} else {
							return console.log("Ошибка реакции");
						}
					}).catch(async err => {
						msg.edit(cancel);
						return;
					});
			}
		} else if (args[0] == "version") {
			message.channel.send(systemInfo);
		} else if (args[0] == "bomb") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			//проверить является пользователь овнером или офицером
			if (!(message.member.roles.cache.has(config.clanLeaderRole) || message.member.roles.cache.has(config.clanOfficerRole))) return message.channel.send(noPermissions);
			if (reclanData.balance < bombPrice) return message.channel.send(noClanBalance);
			let attackToID = args[1];
			if (!attackToID) return message.channel.send(youForgotToSpecifyID);
			//проверить существует ли клан, который атакуют
			attackedData = await reclanModel.findOne({
				name: attackToID
			});
			let thisClanDoesntExist = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Такого клана не существует.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (!attackedData) return message.channel.send(thisClanDoesntExist)
			//проверить является ли клан тем же, что и атаккуют
			if (attackedData.clanID == reclanData.clanID) return message.channel.send(youCantAttackYourClan);
			let timeOut = (bombCooldown - (Date.now() - reclanData.lastBomb));
			const seconds = Math.floor((timeOut / 1000) % 60);
			const minutes = Math.floor((timeOut / 1000 / 60) % 60);
			const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

			let bombOnCooldown = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Вы сможете опять подложить кому-то бомбу через: **${hours}ч. ${minutes}м. ${seconds}с.**`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (Date.now() < (reclanData.lastBomb + bombCooldown)) return message.channel.send(bombOnCooldown);

			let attackToMembersNumber = attackedData.members.length + attackedData.officers.length;
			let membersNeeded = Math.floor(attackToMembersNumber / 100 * 60) + 1;
			let clanColor = message.guild.roles.cache.get(attackedData.roleID).color;
			let attackToWillLost = Math.floor(attackedData.balance / 100 * 8);

			let clanBombEmbed = new Discord.MessageEmbed()
				.setColor(clanColor)
				.setTitle("⸝⸝ ♡₊˚ Вас атакуют!◞")
				.setDescription(`❕ Внимание! Клан <@&${reclanData.roleID}> тайно проник в ваше убежище и заложил в нём **большую бомбу**, установив таймер на 15 минут!\n\nУ вас есть всего **15 минут**, чтобы найти и обезвредить её, иначе ваш клан **потеряет** ${attackToWillLost} ${config.silverCoin}\n\n` + '`' + `Чтобы обезвредить бомбу - 60% (${membersNeeded}) участников клана должны нажать на реакцию 💣` + '`')
				.setTimestamp();

			let clanBombEmbedSuccessSend = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы успешно проникли в убежище клана <@&${attackedData.roleID}> и заложили в нём **бобму**!\nТеперь у клана есть всего **15 минут**, чтобы обезвредить её.\n\nЕсли ваша бомба **не** будет разминирована вовремя, то ваш клан получит ${attackToWillLost} ${config.silverCoin}`)
				.setTimestamp();

			let clanBombEmbedToAttackDefuse = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Поздравляем!◞")
				.setDescription(`Вы успешно обезвредели бомбу от клана <@&${reclanData.roleID}> и смогли защитить ${attackToWillLost} ${config.silverCoin}, а также получили 1000 ${config.silverCoin} на счёт своего клана и 2 трофея 🏆!`)
				.setTimestamp();

			let clanBombAttackToEmbedNotdefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ 💥💥💥💥💥💥◞")
				.setDescription(`К сожалению, ваш клан не успел обезвредить бомбу от клана <@&${reclanData.roleID}> и потерял ${attackToWillLost} ${config.silverCoin} со своего счёта.`)
				.setTimestamp();

			let clanBombEmbedNotdefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Клан <@&${attackedData.roleID}> не успел обезвредить вашу бомбу за 15 минут и она взорвалась!\n\nВы получили ${attackToWillLost} ${config.silverCoin} с их счёта и 6 трофеев 🏆!`)
				.setTimestamp();

			let clanBombEmbedDefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Клан <@&${attackedData.roleID}> успел обезвредить вашу бомбу за 15 минут!\n\nВы потеряли ${bombPrice} ${config.silverCoin} за бомбу.`)
				.setTimestamp();

			await reclanModel.updateOne({
				clanID: userClan
			}, {
				$inc: {
					balance: -bombPrice,
				},
				$set: {
					lastBomb: Date.now()
				}
			});

			await reclanModel.updateOne({
				clanID: attackedData.clanID
			}, {
				$set: {
					underAttack: 1
				}
			});

			message.channel.send(clanBombEmbedSuccessSend);

			const msg = await bot.channels.cache.find(ch => ch.id == attackedData.chatID).send(`<@&${attackedData.roleID}>`, clanBombEmbed);
			await msg.react("💣");
			await msg.awaitReactions((reaction, user) => reaction.count >= (membersNeeded + 1) && (reaction.emoji.name == "💣"), {
					max: 1,
					time: 1000 * 60 * 15
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "💣") {
						message.channel.send(clanBombEmbedToAttackDefuse);
						bot.channels.cache.find(ch => ch.id == reclanData.chatID).send(clanBombEmbedDefused);
						await reclanModel.updateOne({
							clanID: attackedData.clanID
						}, {
							$set: {
								underAttack: 0
							},
							$inc: {
								balance: 1000,
								prize: 2,
							}
						});
						return;
					} else {
						return console.log("Ошибка реакции");
					}
				}).catch(async err => {
					message.channel.send(clanBombAttackToEmbedNotdefused);
					bot.channels.cache.find(ch => ch.id == reclanData.chatID).send(clanBombEmbedNotdefused);
					await reclanModel.updateOne({
						clanID: attackedData.clanID
					}, {
						$set: {
							underAttack: 0
						},
						$inc: {
							balance: -attackToWillLost,
						}
					});
					await reclanModel.updateOne({
						clanID: userClan
					}, {
						$inc: {
							balance: attackToWillLost,
							prize: 6,
						}
					});
					return;
				});
		} else if (args[0] == "rob") {
			//Проверить состоит ли пользователь в клане
			if (userClan == -1) return message.channel.send(youAreNotInClan);
			//проверить является пользователь овнером или офицером
			if (!(message.member.roles.cache.has(config.clanLeaderRole) || message.member.roles.cache.has(config.clanOfficerRole))) return message.channel.send(noPermissions);
			if (reclanData.balance < robPrice) return message.channel.send(noClanBalance);
			let attackToID = args[1];
			if (!attackToID) return message.channel.send(youForgotToSpecifyID);
			//проверить существует ли клан, который атакуют
			attackedData = await reclanModel.findOne({
				name: attackToID
			});
			let thisClanDoesntExist = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Такого клана не существует.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (!attackedData) return message.channel.send(thisClanDoesntExist);
			//проверить является ли клан тем же, что и атаккуют
			if (attackedData.clanID == reclanData.clanID) return message.channel.send(youCantAttackYourClan);
			let timeOut = (robCooldown - (Date.now() - reclanData.lastRob));
			const seconds = Math.floor((timeOut / 1000) % 60);
			const minutes = Math.floor((timeOut / 1000 / 60) % 60);
			const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

			let robOnCooldown = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Вы сможете опять ограбить кого-то через: **${hours}ч. ${minutes}м. ${seconds}с.**`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			if (Date.now() < (reclanData.lastRob + robCooldown)) return message.channel.send(bombOnCooldown);

			let attackToMembersNumber = attackedData.members.length + attackedData.officers.length;
			let membersNeeded = Math.floor(attackToMembersNumber / 100 * 60) + 1;
			let clanColor = message.guild.roles.cache.get(attackedData.roleID).color;
			let attackToWillLost = Math.floor(attackedData.balance / 100 * 4);

			let clanRobEmbed = new Discord.MessageEmbed()
				.setColor(clanColor)
				.setTitle("⸝⸝ ♡₊˚ Вас атакуют!◞")
				.setDescription(`❕ Внимание! Клан <@&${reclanData.roleID}> тайно проник в ваше убежище и пытается украсть у вас деньги. Разветчик атакующего клана убежит с деньгами через 10 минут!\n\nУ вас есть всего **10 минут**, чтобы найти лазутчика, иначе ваш клан **потеряет** ${attackToWillLost} ${config.silverCoin}\n\n` + '`' + `Чтобы найти лазутчика - 60% (${membersNeeded}) участников клана должны нажать на реакцию 👀` + '`')
				.setTimestamp();

			let clanRobEmbedSuccessSend = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Вы успешно проникли в убежище клана <@&${attackedData.roleID}> и стараетесь пройти к их сейфу!\nТеперь у клана есть всего **10 минут**, чтобы обнаружить вас.\n\nЕсли Вас не обнаружат, то ваш клан получит ${attackToWillLost} ${config.silverCoin}`)
				.setTimestamp();

			let clanRobEmbedToAttackDefuse = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Поздравляем!◞")
				.setDescription(`Вы успешно обнаружили и наказали разветчика клана <@&${reclanData.roleID}> и смогли защитить свои ${attackToWillLost} ${config.silverCoin}, а также получили 500 ${config.silverCoin} на счёт своего клана и 1 трофей 🏆!`)
				.setTimestamp();

			let clanRobAttackToEmbedNotdefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ 🏃‍♂️💨💨💨◞")
				.setDescription(`К сожалению, ваш клан не успел найти разветчика клана <@&${reclanData.roleID}> и потерял ${attackToWillLost} ${config.silverCoin} со своего счёта.`)
				.setTimestamp();

			let clanRobEmbedNotdefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Клан <@&${attackedData.roleID}> не успел поймать вашего разветчика за 10 минут и он смог убежать!\n\nВы получили ${attackToWillLost} ${config.silverCoin} с их счёта и 3 трофея 🏆!`)
				.setTimestamp();

			let clanRobEmbedDefused = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`Клан <@&${attackedData.roleID}> успел найти вашего разветчика за 10 минут!\n\nВы потеряли ${robPrice} ${config.silverCoin}.`)
				.setTimestamp();

			await reclanModel.updateOne({
				clanID: userClan
			}, {
				$inc: {
					balance: -robPrice,
				},
				$set: {
					lastRob: Date.now()
				}
			});

			await reclanModel.updateOne({
				clanID: attackedData.clanID
			}, {
				$set: {
					underAttack: 1
				}
			});

			message.channel.send(clanRobEmbedSuccessSend);

			const msg = await bot.channels.cache.find(ch => ch.id == attackToChat).send(`<@&${attackedData.roleID}>`, clanRobEmbed);
			await msg.react("👀");
			await msg.awaitReactions((reaction, user) => reaction.count >= (membersNeeded + 1) && (reaction.emoji.name == "👀"), {
					max: 1,
					time: 1000 * 60 * 10
				})
				.then(async collected => {
					msg.reactions.removeAll();

					if (collected.first().emoji.name == "👀") {
						message.channel.send(clanRobEmbedToAttackDefuse);
						bot.channels.cache.find(ch => ch.id == reclanData.chatID).send(clanRobEmbedDefused);
						await reclanModel.updateOne({
							clanID: attackedData.clanID
						}, {
							$set: {
								underAttack: 0
							},
							$inc: {
								balance: 500,
								prize: 1
							}
						});
						return;
					} else {
						return console.log("Ошибка реакции");
					}
				}).catch(async err => {
					message.channel.send(clanRobAttackToEmbedNotdefused);
					await reclanModel.updateOne({
						clanID: attackedData.clanID
					}, {
						$set: {
							underAttack: 0
						},
						$inc: {
							balance: -attackToWillLost,
						}
					});
					await reclanModel.updateOne({
						clanID: reclanData.clanID
					}, {
						$inc: {
							balance: attackToWillLost,
							prize: 3
						}
					});
					bot.channels.cache.find(ch => ch.id == reclanData.chatID).send(clanRobEmbedNotdefused);
					return;
				});
		} else if (args[0] == "top") {
			results = await reclanModel.find({}).sort({
				prize: -1
			}).limit(5);

			var lbString = "";
			var lbPos = 1;
			var lbEmoji = "";

			for (let i = 0; i < results.length; i++) {
				const {
					roleID,
					prize = 0
				} = results[i];

				switch (lbPos) {
					case 1:
						lbEmoji = "🥇"
						break;
					case 2:
						lbEmoji = "🥈"
						break;
					case 3:
						lbEmoji = "🥉"
						break;
					default:
						lbEmoji = ""
						break;
				}
				if (lbPos <= 3) {
					lbString += lbEmoji + ` <@&${roleID}>\nТрофеев: ` + prize + ` 🏆\n\n`;
				} else {
					lbString += lbPos + `. ` + ` <@&${roleID}>\nТрофеев: ` + prize + ` 🏆\n\n`;
				}
				lbPos++;
			}
			var lbEmbed = new Discord.MessageEmbed()
				.setColor(config.defaultColor)
				.setTitle("⸝⸝ ♡₊˚ Топ кланов◞")
				.setDescription("```Топ 5 с наибольшим количеством трофеев:```\n" + lbString)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			message.channel.send(lbEmbed);
		} else if (args[0] == "help") {
			let clanHelpEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Кланы◞")
				.setDescription(`**.reclan** - информация о клане\n**.reclan help** - данное сообщение\n**.reclan create <название клана>** - создать клан за ${clanPrice} ${config.silverCoin}\n**.reclan delete** - удалить клан\n**.reclan invite <@пользователь>** - пригласить пользователя в клан\n**.reclan kick <@пользователь>** - выгнать пользователя из клана\n**.reclan leave** - покинуть клан\n**.reclan officer <@пользователь>** - назначить/убрать пользователя на/с должность(-и) офицер(-а)\n**.reclan deposit <1-15000>** - пополнить счёт клана\n**.reclan color <hex>** - установить цвет клана за ${colorPrice} ${config.silverCoin}\n**.reclan symbol <emoji>** - установить символ(ы) клана за ${symbolPrice} ${config.silverCoin}\n**.reclan description <описание>** - установить описание клана за ${descriptionPrice} ${config.silverCoin}\n**.reclan banner <ссылка>** - установить баннер клана за ${bannerPrice} ${config.silverCoin}\n**.reclan rename <название клана>** - переименовать клан за ${renamePrice} ${config.silverCoin}\n**.reclan perks** - посмотреть возможные улучшения для клана и их цены\n**.reclan upgrade <индекс>** - улучшить клан\n**.reclan bomb <название клана>** - заложить бомбу в клане\n**.reclan rob <название клана>** - ограбить клан\n**.reclan top** - топ кланов`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			message.channel.send(clanHelpEmbed);
		} else {
			let clanName = args.slice(0).join(' ');

			reclanData = await reclanModel.findOne({
				name: clanName,
			})

			let clanNotExist = new Discord.MessageEmbed()
				.setColor(`${config.errColor}`)
				.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
				.setDescription(`Клана '${clanName}' не существует. Возможно, что Вы допустили ошибку в названии.`)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			if (!reclanData) return message.channel.send(clanNotExist)



			let clanColor = message.guild.roles.cache.get(reclanData.roleID).color;

			let dateStamp = new Date(reclanData.creationDate),
				createDate = [dateStamp.getDate(),
					dateStamp.getMonth() + 1,
					dateStamp.getFullYear()
				].join('/') + ' ' + [dateStamp.getHours(),
					dateStamp.getMinutes()
				].join(':');

			let memberAmount = reclanData.members.length + reclanData.officers.length;

			let membersDividedTwo = 1;
			if (Math.floor(memberAmount / 2) > 0) {
				clanxpmult = Math.floor(memberAmount / 2);
			}

			let membersField = "Нет";
			if (reclanData.members.length > 0) {
				membersField = "";
				reclanData.members.slice(-7).forEach(async user => {
					membersField += `<@${user.memberID}>\n`
				})
				if ((reclanData.members.length - 7) > 0) {
					membersField += `И ${reclanData.members.length-7} ещё...`
				}
			}

			let officersField = "Нет";
			if (reclanData.officers.length > 0) {
				officersField = "";
				reclanData.officers.slice(-7).forEach(async user => {
					officersField += `<@${user.memberID}>\n`
				})
				if ((reclanData.officers.length - 7) > 0) {
					officersField += `И ${reclanData.officers.length-7} ещё...`
				}
			}

			let isBanner = "Да";
			if (reclanData.bannerLink == "" || reclanData.bannerLink == " " || reclanData.bannerLink == null) {
				isBanner = "Нет";
			}

			let coinBoost = reclanData.coinMultiply;
			let lvlBoost = reclanData.lvlMultiply;
			let clanXPNeed = xplvlmult * reclanData.level * membersDividedTwo;

			var clanDataEmbed = new Discord.MessageEmbed()
				.setColor(clanColor)
				.setFooter(`${author.username}`, `${author.displayAvatarURL({dynamic: true})}`)
				.setDescription(`**⸝⸝ ♡₊˚ Клан : <@&${reclanData.roleID}> ${reclanData.symbols}◞**\n${reclanData.description}`)
				.addField(`👤 В клане`, '```' + `${memberAmount}/${reclanData.slots}` + '```', inline = true)
				.addField(`🏆 Трофеи`, '```' + `${reclanData.prize}` + '```', inlite = true)
				.addField(`📆 Дата основания`, '```' + `${reclanData.creationDate}` + '```', inline = true)
				.addField(`🌟 Уровень`, '```' + `${reclanData.level}` + '```', inline = true)
				.addField(`⭐ Опыт`, '```' + `${reclanData.xp}/${clanXPNeed}` + '```', inline = true)
				.addField(`${config.silverCoin} Баланс`, '```' + `${reclanData.balance}` + '```', inlite = true)
				.addField(`☄️ Буст серебра`, '```' + `x${reclanData.coinMultiply}` + '```', inlite = true)
				.addField(`🎴 Баннер`, '```' + `${isBanner}` + '```', inlite = true)
				.addField(`🔮 Буст уровня`, '```' + `x${reclanData.lvlMultiply}` + '```', inlite = true)
				.addField(`୨୧ ・ Основатель:`, `<@${reclanData.ownerID}>`, inline = true)
				.addField(`୨୧ ・ Офицеры:`, `${officersField}`, inline = true)
				.addField(`୨୧ ・ Участники:`, `${membersField}`, inline = true)
				.setTimestamp();

			if (!(reclanData.bannerLink == "" || reclanData.bannerLink == " " || reclanData.bannerLink == null)) {
				clanDataEmbed.setImage(reclanData.bannerLink);
			}

			message.channel.send(clanDataEmbed);
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "clan"
};