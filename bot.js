//шиоми бай аверли, заебал.
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const mongoose = require('mongoose');
const fs = require('fs');
const Canvas = require('canvas');
const path = require('path');
const helloWords = ["welcome", "добро пожаловать", "welc", "приветствую", "привет", "хай", "хааай", "хаай", "приветик", "ласкаво просимо"];
const repWords = ["welcome", "добро пожаловать", "welc", "приветствую", "привет", "хай", "хааай", "хаай", "приветик", "ласкаво просимо", "красиво", "ты молодец", "красивая", "красивый", "прекрасный", "прекрасная", "хороший", "хорошая", "классно", "круто", "крутой", "крутая", "крутышка", "+реп", "+ реп", "+ репутация", "+репутация", "плюс реп", "плюс репутация", ":)", "♥", ")", "))", ")))"];
const minusRepWorld = ["хуй", "пизда", "залупа", "уебан", "уёбок", "уебок", "хуесос", "блядина", "пиздолиз", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "чурка", "мать ебал", "мать твою ебал", "ебал мать", "чё с хуя", "че с хуя", "псина ебаная", "псина ёбаная"];
const config = require("./botconfig.json");
const token = config.token;
const prefix = config.prefix;
//mongoose
//подключение моделей
const profileModel = require('./schemas/profileSchema.js');
const pvcModel = require('./schemas/pvcSchema.js');
const dailyModel = require('./schemas/dailySchema.js');
const vctimeModel = require('./schemas/vctimeSchema.js');
const rbModel = require('./schemas/rbSchema.js');
const loveroomModel = require('./schemas/loveroomSchema.js');
const clanModel = require('./schemas/reclanSchema.js');
const botUptime = require('./schemas/uptime.js');
const actionModel = require('./schemas/actionSchema.js');
const giveawayModel = require('./schemas/giveAwaySchema.js');
//Цены
const prCost = 35;
//Кланы
const xplvlmult = 4320;
//Сообщения в чат
const announce = [
	`Хочешь помочь \`Teiko\`, но не знаешь как? Подай заявку на роль <@&831929702431850558>! [Тыкай тут, чтобы перейти к заявке.](https://docs.google.com/forms/d/e/1FAIpQLSc7v-BNtFq195kBbXTGPHdzNc1GLtPtULr3BD2kSkJbq-7_aA/viewform)`,
	`За 3 сообщения в чате - ты получаешь 1 <:TeikoSilver:830577283613065218> (DSC), а за одну минуту проведённую в любом, из доступных тебе, голосовых каналов - ты получишь 2 <:TeikoSilver:830577283613065218> (DSC)`,
	`Не забывай, что у нас есть minecraft сервер *EximiaWorld* под версию игры *1.16.4+*\nIP: **mc.eximiaworld.net**`,
	`Не забывай читать <#831346233079103508> :)`,
	`Летний подарочный код для каждого участника: \`DES-RAU-BBMM-ITER\`\n\nПиши: \`.code DES-RAU-BBMM-ITER\``, //TEMPRORARY
	`<#830207759059648522> это общий канал для общения пользователей. На нём действуют некоторые <#831346233079103508> общения, которые тебе требуется соблюдать. На самом деле, правило всего одно - не будь плохим человеком. Teiko - это сервер, который сделан людьми - для людей.`,
	`Чтобы узнать все команды сервера - напиши \`.help\` и прочти небольшой список.`,
	`На сервере присутствует система профилей, которая позволяет тебе *выделяться* среди других людей. Ты можешь менять эмоджи, которые находятся перед названиями категорий в твоём профиле. Поставить *собственный* баннер, статус или изменить цвет линии профиля.`,
	`Не забывай собирать ежедневные награды, которые доступны раз в 12 часов. А получить эту награду возможно написав \`.daily\``,
	`Чтобы передать серебро какому-то из пользователей используй команду \`.transfer <@пользователь> <кол-во серебра>\``,
	`Если тебе вдруг стало скучно или хочется расслабиться, то ты можешь использовать команду \`.cc\`, чтобы поиграть в казино.`,
	`\`.roleshop\` - магазин ролей, которые ты можешь покупать за серебро или золото и надевать их на себя.\n\`.emojishop\` - магазин эмоджи, которые ты можешь ставить в свой профиль, чтобы ещё больше выделяться среди других и добавить больше красок.`,
	`Пришёл на \`Teiko\` со своей половинкой? Вы можете заключить с ней брак и создать любовную комнату. Это отличный выбор для тех, кто ищет свой личный уголок для уединений.`,
	`Создай гильдию, чтобы показать класс всему комьюнити. Для кланов существуют разные перки, которые можно прокачивать. Буст серебра и уровня, личный баннер клана, кубки, которые зарабатываются потом и кровью в битвах и многое другое. Пиши \`.clan help\``,
	`Чтобы посмотреть список *знаков отличия* [тык тут](https://discord.com/channels/828718973444423722/840945140578385931/843241837175111682)!`
	];
//Роли на реакции
//Типы:
//      0 - добавлять и убирать
//      1 - только добавлять
//      2 - только удалять
const reactrole = [{
		emoji: "♀",
		roleID: "948886657480925184",
		channelID: "948888758542032978",
		messageID: "949206176657207296",
		type: 1,
		single: 0,
	},
	{
		emoji: "🔸",
		roleID: "",
		channelID: "",
		messageID: "",
		type: 1,
		single: 0,
	},
	{
		emoji: "♂",
		roleID: "948886686706839592",
		channelID: "948888758542032978",
		messageID: "949206176657207296",
		type: 1,
		single: 0,
	},
	{
		emoji: "🌟",
		roleID: "",
		channelID: "",
		messageID: "",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:csgo:841064013492387891>",
		roleID: "831930328926126110",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:rust:841064014108033064>",
		roleID: "831930349340459058",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:dota2:841064013534068767>",
		roleID: "831930361969639454",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:GTAV:841064013940260935>",
		roleID: "831930379278876693",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:overwatch:841064014057439233>",
		roleID: "831930391572775002",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:pubg:841064015874621520>",
		roleID: "831930403802841158",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:minecraft:841064013638139944>",
		roleID: "831930418063605830",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:valorant:841064013697777756>",
		roleID: "831930432391086080",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:leagueoflegends:841064013990330429>",
		roleID: "831930445981548564",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:fortnite:841064013646528512>",
		roleID: "831930458798948381",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	},
	{
		emoji: "<:apex_legends:841064015475113994>",
		roleID: "831930471197442058",
		channelID: "831676061317726218",
		messageID: "844982411003035708",
		type: 0,
		single: 0,
	}
];

//подключение манго
mongoose.connect(config.mongodb_srv, {
}).then(() => {
	console.info('---MONGO---');
	console.info('Connected to the database!');
	console.info('---MONGO---');
}).catch((err) => {
	console.warn('---MONGO-ERROR---');
	console.warn(err);
	console.warn('---MONGO-ERROR---');
})

//чтение команд и их загрузка
fs.readdir('./cmds/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js")
	if (jsfiles.length <= 0) console.log("нет команд для загрузки!");
	console.log(`загружено ${jsfiles.length} команд`);
	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i+1}. ${f} загружен!`);
		bot.commands.set(props.help.name, props);
		bot.commands.set(props.help.alias, props);
	})
})

//запуск бота
bot.on('ready', async () => {
	try {
		//const channels = bot.channels.cache.filter(c => c.type === 'voice');

		bot.generateInvite(["ADMINISTRATOR"]).then(link => {
			console.log(link);
		})
		console.log(`Запустился бот ${bot.user.username}\n\n`);
		console.info('.______..._______..______...._______.._______.._______..___..._______.......');
		console.info('|......|.|.......||...._.|..|..._...||.._....||.._....||...|.|.......|......');
		console.info('|.._....||....___||...|.||..|..|_|..||.|_|...||.|_|...||...|.|_....._|......');
		console.info('|.|.|...||...|___.|...|_||_.|.......||.......||.......||...|...|...|........');
		console.info('|.|_|...||....___||....__..||.......||.._...|.|.._...|.|...|...|...|...___..');
		console.info('|.......||...|___.|...|..|.||..._...||.|_|...||.|_|...||...|...|...|..|...|.');
		console.info('|______|.|_______||___|..|_||__|.|__||_______||_______||___|...|___|..|___|.');
		bot.user.setPresence({
			status: "online",
			activity: {
				name: ".help // Teiko.",
				type: "LISTENING"
			}
		});

		await actionModel.updateMany({ inAction: { $gt: 0 } }, { $set: {inAction: 0} });

		uptimeData = await botUptime.findOne({
			name: 'Dead_rabbit_bot'
		});
		if (!uptimeData) {
			let newUptime = await botUptime.create({
				name: 'Dead_rabbit_bot',
				uptime: 0,
			});
			//сохранение записи
			newUptime.save();
		}

		//цикл раз в секунду
		setInterval(async function() {
			try {
				//снимать роль РБ, если время наказания прошло
				let memberList = bot.guilds.cache.get(config.serverId).roles.cache.get(config.rbRole).members.map(m => m);

				memberList.forEach(async user => {
					try {
						rbData = await rbModel.findOne({
							userID: user.id,
						});
						if (rbData) {
							let reason = rbData.reason;
							let unrbEmd = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Наказания◞")
								.setFooter(`${user.user.tag}`, `${user.user.displayAvatarURL({dynamic: true})}`)
								.setDescription(`С ${user} было снято наказание за ` + "`" + reason + "`")
								.setTimestamp();

							let userTimeout = rbData.timeout;
							let userGetRb = rbData.rbGet;
							if (Date.now() > (userGetRb + userTimeout) && user.roles.cache.has(config.rbRole)) {
								await user.roles.remove(config.rbRole);
								await bot.channels.cache.get(config.floodChannel).send(unrbEmd);
							}
						}
					} catch (err) {
						console.log(err);
					}
				});

				bot.channels.cache.filter(c => c.type === 'voice').forEach(async channel => {
					for (let [memberID, member] of channel.members) {
						let uid = memberID;
						if (!member.user.bot) {
							//чек есть ли профиль войс актива
							vctimeData = await vctimeModel.findOne({
								userID: member.id
							});
							//создание профиля войс актива
							if (!vctimeData) {
								let vctime = await vctimeModel.create({
									userID: uid,
									vctime: 0,
								});
								//сохранение записи
								vctime.save();
							}

							//GIVEAWAY DISCORD NITRO
							giveawayData = await giveawayModel.findOne({
								userID: member.id
							});
							if (!giveawayData) {
								let giveaway = await giveawayModel.create({
									userID: uid,
									time: 0,
								});
								//сохранение записи
								giveaway.save();
							}

							//добавление 1 секунды в профиль войс актива
							vctimeResponse = await vctimeModel.updateOne({
								userID: uid,
							}, {
								$inc: {
									vctime: 1000
								}
							});
							//добавление 1 секунды в GIVEAWAY DISCORD NITRO
							if (channel.id == "828718973444423726" || channel.id == "829370912524337203" || channel.id == "829370967268524113" || channel.id == "829370985803022356") {
								giveawayResponse = await giveawayModel.updateOne({
									userID: uid,
								}, {
									$inc: {
										time: 1000
									}
								});
							}
						}
					}
				});

				// const category = await bot.channels.cache.get(config.createChannelCategory);
				// category.children.forEach(channel => {
				//  if (channel.members.size <= 0 && channel.id != config.createChannelId) {
				//      channel.delete()
				//  }
				// });

			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		}, 1000);
		//сообщения каждые 15 минут в чат
		setInterval(async function() {
			let announceEmbed = new Discord.MessageEmbed()
				.setTitle(`♡𓂃˚ Teiko◞`)
				.setColor(3092790)
				.setDescription(announce[Math.floor(Math.random() * announce.length)])

		
		}, 1000 * 60 * 15);
		//выдача подарков юзерам
		setInterval(async function() {
			let usersInVoiceChannels = [];
			bot.channels.cache.filter(c => c.type === 'voice').forEach(async channel => {
				for (let [memberID, member] of channel.members) {
					if (!member.user.bot) usersInVoiceChannels.push(member.id);
				}
			});
			if (usersInVoiceChannels.length > 0) {
				let randomUserId = usersInVoiceChannels[Math.floor(Math.random() * usersInVoiceChannels.length)];
				let randCoins = Math.floor(Math.random() * 70) + 30;

				let giftEmbed = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Вам подарок. У Вас есть 2 минуты, чтобы забрать его.**\n**Нажмите на 🎁, чтобы забрать его.**`)
					.setColor(3092790)
					.setTimestamp();

				let giftEmbedSuccess = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Вы забрали свой подарок!**\n**Получено:** ${randCoins} ${config.silverCoin}`)
					.setColor(3092790)
					.setTimestamp();

				let giftEmbedCancel = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Подарок не забрали.**`)
					.setColor(3092790)
					.setTimestamp();

				const msg = await bot.channels.cache.find(ch => ch.id == config.mainChannel).send(`<@${randomUserId}>`, giftEmbed);
				await msg.react("🎁");
				await msg.awaitReactions((reaction, user) => user.id == randomUserId && (reaction.emoji.name == "🎁"), {
						max: 1,
						time: 120000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "🎁") {

							msg.reactions.removeAll();

							profileData = await profileModel.updateOne({
								userID: randomUserId,
							}, {
								$inc: {
									silverCoins: randCoins,
								}
							});

							msg.edit(giftEmbedSuccess);

							return;
						} else {
							return console.log("Ошибка реакции");
						}
					}).catch(async err => {
						msg.edit(giftEmbedCancel);
						msg.reactions.removeAll();
						return;
					});
			}
		}, 1000 * 60 * 90);
		//цикл, который срабатывает раз в минуту
		setInterval(async function() {
			try {
				// let inloveList = bot.guilds.cache.get(config.serverId).roles.cache.get(config.inLoveRole).members.map(m => m)

				// inloveList.forEach(member => {
				// 	loveroomData = await loveroomModel.findOne({
				// 		userID: member.id
				// 	});

				// 	let lastPayment = 0;
				// 	if (loveroomData) {
				// 		lastPayment = loveroomData.loveroomLastpayment;
				// 	}
				// 	if (lastPayment >)
				// })

				const canvas = Canvas.createCanvas(960, 540);
		    	Canvas.registerFont(path.join(__dirname, './LucyGlitch.ttf'), { family: 'LucyGlitch' })
				const ctx = canvas.getContext('2d');

				const background = await Canvas.loadImage(
					path.join(__dirname, './Teikobanner.png')
				);

				ctx.drawImage(background, 0, 0);

				ctx.fillStyle = '#ffffff';
				ctx.font = '60px "LucyGlitch"';

				function checkTime(i) {
					if (i < 10) {
						i = "0" + i;
					}
					return i;
				}
				var today = new Date();
				today.setHours(today.getHours() + 3)
				var h = checkTime(today.getHours());
				var m = checkTime(today.getMinutes());

				y = 225;
				x = 203;

				let text = `${h}:${m}`
				ctx.fillText(text, x, y);

				y = y + 125;

				text = bot.guilds.cache.get(config.serverId).memberCount;
				ctx.fillText(text, x, y);

				y = y + 135;

				let allVoiceChannels = bot.channels.cache.filter(c => c.type === 'voice');
				let userCount = 0;
				for (const [id, voiceChannel] of allVoiceChannels) userCount += voiceChannel.members.size;
				text = userCount;
				ctx.fillText(text, x, y);

				//bot.guilds.cache.get(config.serverId).setBanner(canvas.toBuffer());

				bot.channels.cache.filter(c => c.type === 'voice').forEach(async channel => {
					for (let [memberID, member] of channel.members) {
						let uid = memberID;
						//создание нового документа в базе данных манго, если юзер не является ботом
						if (!member.user.bot) {
							//чек есть ли профиль
							profileData = await profileModel.findOne({
								userID: uid
							});
							//создание основного профиля
							if (!profileData) {
								let profile = await profileModel.create({
									userID: uid,
									silverCoins: 200,
									goldCoins: 0,
									xp: 0,
									lvl: 1,
									msgs: 0,
									msgsForCoinGet: 0,
									reputation: 0,
									clan: "Нет",
									marriage: "Нет",
									profileStatus: config.defaultPStatus,
									profileBanner: config.defaultPBanner,
									profileLine: config.defaultPLine,
									achievements: " ",
								});
								//сохранение записи
								profile.save();
							}

							//добавить минуту в uptime
							uptimeData = await botUptime.updateOne({
								name: 'Dead_rabbit_bot'
							}, {
								$inc: {
									uptime: 30000,
								}
							});

							//добавление серебра, ХР и репутации, если человек находится в войсе
							let userClan = profileData.clan;
							let clanCoinBoost = 1;
							let clanLvlBoost = 1;
							if (userClan != -1) {
								clanData = await clanModel.findOne({
									clanID: userClan
								});
								if (clanData) {
									clanCoinBoost = clanData.coinMultiply;
									clanLvlBoost = clanData.lvlMultiply;
								}
							}
							await profileModel.updateOne({
								userID: uid,
							}, {
								$inc: {
									silverCoins: 2 * clanCoinBoost,
									xp: 2 * clanLvlBoost,
									reputation: 1
								}
							});

							profileData = await profileModel.findOne({
								userID: uid
							});

							if (profileData.xp >= 100 * profileData.lvl) {
								xpAddResponce = await profileModel.updateOne({
									userID: uid,
								}, {
									$set: {
										xp: 0
									},
									$inc: {
										lvl: 1
									}
								});
							}

							vctimeData = await vctimeModel.findOne({
								userID: uid
							});
							let uservctime = 0;
							uservctime = vctimeData.vctime;
							let nextvoicelvl = 180000000;
							if (uservctime >= nextvoicelvl && !member.roles.cache.has(config.newVoiceLvlRole)) {
								member.roles.add(config.newVoiceLvlRole);

								let newVoiceLvl = new Discord.MessageEmbed()
									.setColor(`${config.defaultColor}`)
									.setTitle("⸝⸝ ♡₊˚ Поздравляем!◞")
									.setDescription(`Вы достигли **второго уровня** голосовых каналов и для Вас были открыты новые каналы!\n\nСпасибо, что выбрали Teiko!`)
									.setTimestamp();

								bot.channels.cache.get(config.floodChannel).send(`<@${uid}>`, newVoiceLvl);
							}

							//кланы и опыт клана
							if (userClan != -1) {
								clanData = await clanModel.findOne({
									clanID: userClan
								});
								if (clanData) {
									//найти клан, если существует и добавить опыт
									await clanModel.updateOne({
										clanID: userClan,
									}, {
										$inc: {
											xp: 2
										}
									});
									clanData = await clanModel.findOne({
										clanID: userClan
									});
									let clanXp = clanData.xp;
									let clanLvl = clanData.level;

									let memberAmount = clanData.members.length + clanData.officers.length;
									let membersDividedTwo = 1;
									if (Math.floor(memberAmount / 2) > 0) {
										clanxpmult = Math.floor(memberAmount / 2);
									}
									let clanXPNeed = xplvlmult * clanData.level * membersDividedTwo;
									console.log(`${userClan} ` + clanXPNeed);
									console.log(`${userClan} ` + clanXp);
									if (clanXp >= clanXPNeed) {
										await clanModel.updateOne({
											clanID: userClan,
										}, {
											$set: {
												xp: 0
											},
											$inc: {
												level: 1
											}
										});
									}
								} else {
									console.warn(`[${uid}] No Data about clan: ${userClan}`);
								}
							}
							if ((Date.now() - member.joinedAt) > 7776000000 && !member.roles.cache.has(config.nativeRole)) {
								member.roles.add(config.nativeRole);
							}
						}
					}
				});
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		}, 60000);
		bot.channels.cache.get(config.verificationChannel).messages.fetch(config.verificationMessage).then(m => {
			m.react("✅");
		});
		reactrole.forEach(obj => {
			bot.channels.cache.get(obj.channelID).messages.fetch(obj.messageID).then(m => {
				m.react(obj.emoji).catch(err => {console.log(err);})
			})
		})

		serverClans = await clanModel.find({});
		if (serverClans.length > 0) {
			serverClans.forEach(async obj => {
				if (obj.underAttack == 1) {
					let errOfAttack = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ X ₊˚ Критическая ошибка◞")
						.setDescription(`**Бот сервера был перезагружен, а атака на ваш клан остановлена.**`)
						.setTimestamp();
					bot.channels.cache.find(ch => ch.id == obj.clanChat).send(errOfAttack);
					clanData = await clanModel.updateOne({
						ownerID: obj.userID
					}, {
						$set: {
							underAttack: 0
						}
					});
					console.info('---CLAN DEBUG---');
					console.info(`'underAttack' FOR CLAN ${obj.name} (${obj.userID}) IS FIXED AND SET TO '0'`);
					console.info('---CLAN DEBUG---');
				}
					if (!bot.guilds.cache.get(config.serverId).member(obj.userID)) {
						ownClanData = await clanModel.findOne({
							ownerID: obj.userID
					})
					if (ownClanData) {
						let clanMembers = ownClanData.members;
						let clanOfficers = ownClanData.officers;
						let clanRoleId = ownClanData.clanRole;
						let clanName = ownClanData.name;

						message.guild.roles.cache.get(clanRoleId).delete();

						message.guild.channels.cache.forEach((channel) => {
							if (channel.name == clanName)
								channel.delete()
								.catch((e) => console.log(`Could not delete ${channel.name} because of ${e}`))
						});

						clanDeleteResponce = await clanModel.deleteOne({
							userID: obj.userID
						});

						profileData = await profileModel.updateOne({
							userID: obj.userID,
						}, {
							$set: {
								clan: -1
							}
						});

						if (clanMembers.length > 0) {
							clanMembers.forEach(async user => {
								try {
									profileData = await profileModel.updateOne({
										userID: user.memberID,
									}, {
										$set: {
											clan: "Нет"
										}
									});
								} catch (err) {
									if (err.name === "ReferenceError")
										console.log("У вас ошибка")
									console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
								}
							})
						}
						if (clanOfficers.length > 0) {
							clanOfficers.forEach(async user => {
								try {
									profileData = await profileModel.updateOne({
										userID: user.memberID,
									}, {
										$set: {
											clan: "Нет"
										}
									});
								} catch (err) {
									if (err.name === "ReferenceError")
										console.log("У вас ошибка")
									console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
								}
							})
						}
					}
				}
			});
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});
bot.on("messageReactionAdd", async (reaction, user) => {
	try {
		if (!user || user.bot || !reaction.message.channel.guild) return;
		let msg = reaction.message;
		let member = bot.guilds.cache.get(config.serverId).members.cache.get(user.id);
		if (msg.id == config.verificationMessage && msg.channel.id == config.verificationChannel) {
			if (!member.roles.cache.has(config.nonverifiedUserRole)) {
				member.roles.add(config.nonverifiedUserRole).then(c => {
					let embed = new Discord.MessageEmbed()
						.setColor(config.defaultColor)
						.setTitle('⸝⸝ ♡₊˚ Встречаем нового участника!◞')
						.setDescription(`Привет, ${member.user.username}. Добро пожаловать в дивный новый мир! Чувствуй себя как дома. Чтобы тебе было легче ориентироваться на сервере, прочитай [навигацию](https://discord.gg/sFNyk56Dxp) по серверу`)
						.setFooter(`${member.user.username}`, `${member.user.displayAvatarURL({dynamic: true})}`)
						.setThumbnail(`${member.user.displayAvatarURL({dynamic: true})}`)
						.setTimestamp();

					member.guild.channels.cache.get(config.mainChannel).send(embed);
					const welcomeMessageWelc = [`Привет, ${member}, добро пожаловать на сервер Teiko.`, `Здравствуй, ${member}, и добро пожаловать на сервер Teiko.`, `Добро пожаловать на сервере Teiko, ${member}.`, `${member}, добро пожаловать на сервер Teiko.`, `Привет, дорогой ${member}. Ты новенький на сервере Teiko?`, `Приветствую на сервере Teiko, ${member}!`, `${member}, добро пожаловать в дивный новый мир, друг!`, `${member}, приветствую в новом дивном мире!`]
					const welcomeMessageName = [`Меня зовут Yuno .`, `Я - Yuno.`, `Можешь называть меня Yunya.`, `Можешь звать меняc Yuno.`, `Твоё имя мы уже знаем, а меня ты можешь называть Yuno.`, `Как дела? Меня зовут Yuno.`, `Меня называют Yuno.`];
					const welcomeMessageLittleAbout = [`Я буду твоим личным гидом по данному серверу.`, `Я помогу тебе разобраться с функциями сервера!`, `Я помогу узнать тебе всю нужную информацию о данном сервере.`, `Я буду твоим помощником на сервере.`, `Я буду помогу тебе разобраться с этим сервером.`, `Я отвечу на любой твой вопрос, связанный с данным сервером.`, `Теперь я твой личный гид по серверу и помогу тебе узнать обо всём, что тут есть.`, `Я твой личный помощник на этом сервере и помогу тебе разобраться с его функциями.`];
					const welcomeMessageEnding = [`Если у тебя есть какой-то вопрос, то обязательно задай его мне!`, `Если у тебя будут какие-то вопросы по поводу данного сервера, то задавай их мне!`, `Если тебе нужна помощь по серверу, то обязательно обращайся ко мне.`, `Если тебе захочется что-то спросить о сервере, то спроси у меня и я отвечу!`, `Если тебе требуется помощь по функционалу сервера, то спроси у меня!`, `Если тебе интересно, чем ты можешь тут заняться - обращайся ко мне.`, `Если ты хочешь узнать что-то о сервере - спроси меня!`, `Если тебе потребуется подсказка по функциям сервера - узнай у меня!`];
					const welcomeMessageExamples = [`<@${config.botId}> как мне создать свой клан?`, `<@${config.botId}> чем тут заняться?`, `<@${config.botId}> расскажи о себе.`, `<@${config.botId}> куда отправлять свои фотографии?`, `<@${config.botId}> как создать приватку?`, `<@${config.botId}> как создать любовную комнату?`];
					let welcomeMessage = welcomeMessageWelc[Math.floor(Math.random() * welcomeMessageWelc.length)] + ' ' + welcomeMessageName[Math.floor(Math.random() * welcomeMessageName.length)] + ' '  + welcomeMessageLittleAbout[Math.floor(Math.random() * welcomeMessageLittleAbout.length)] + ' ' + welcomeMessageEnding[Math.floor(Math.random() * welcomeMessageEnding.length)] + '\n' + 'Пример: ' + welcomeMessageExamples[Math.floor(Math.random() * welcomeMessageExamples.length)];
					member.guild.channels.cache.get(config.mainChannel).send(welcomeMessage);
				});
			}
		}
		let indexes = [];
		for (let i = 0; i < reactrole.length; i++) {
			if (reactrole[i].messageID == msg.id) indexes.push(i);
		}
		indexes.forEach(index => {
			let emojiName = reactrole[index].emoji.split(":");
			emojiName = emojiName[1];
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && member.roles.cache.has(reactrole[index].roleID) && reactrole[index].single == 1 && (reactrole[index].emoji != reaction.emoji.name || emojiName != reaction.emoji.name)) {
				member.roles.remove(reactrole[index].roleID);
			}
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && (reactrole[index].emoji == reaction.emoji.name || emojiName == reaction.emoji.name)) {
				if (reactrole[index].type == 0 || reactrole[index].type == 1) {
					member.roles.add(reactrole[index].roleID);
				} else if (reactrole[index].type == 2) {
					member.roles.remove(reactrole[index].roleID);
					msg.reactions.cache.find(r => r.emoji.name == reaction.emoji.name).users.remove(member);
				}
			}
		});
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.on("messageReactionRemove", async (reaction, user) => {
	try {
		if (!user || user.bot || !reaction.message.channel.guild) return;
		let msg = reaction.message;
		let msgReactIndex = reactrole.findIndex(x => x.messageID === msg.id);
		let member = bot.guilds.cache.get(config.serverId).members.cache.get(user.id);

		let indexes = [];
		for (let i = 0; i < reactrole.length; i++) {
			if (reactrole[i].messageID == msg.id) indexes.push(i);
		}
		indexes.forEach(index => {
			let emojiName = reactrole[index].emoji.split(":");
			emojiName = emojiName[1];
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && (reactrole[index].emoji == reaction.emoji.name || emojiName == reaction.emoji.name) && (reactrole[index].type == 0 || reactrole[index].type == 2)) {
				member.roles.remove(reactrole[index].roleID);
			}
		});
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});



//делать что-то при ВЫХОДЕ юзера с сервера
bot.on('guildMemberRemove', async member => {
	try {
		let uid = member.id;
		//Удалять брак
		profileData = await profileModel.findOne({
			userID: uid
		});
		let userMarriage = profileData.marriage;
		if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) {
			profileData = await profileModel.updateOne({
				userID: uid,
			}, {
				$set: {
					marriage: "Нет"
				}
			});

			profileData = await profileModel.updateOne({
				userID: userMarriage,
			}, {
				$set: {
					marriage: "Нет"
				}
			});

			let divorceByLeave = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Браки◞")
				.setDescription(`К сожалению, Ваш партнёр вышел с сервера и ваш брак был расторгнут.`)
				.setTimestamp();

			bot.users.cache.get(userMarriage).send(divorceByLeave);
			bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage).roles.remove(config.inLoveRole);

			let loveroomId = 0;
			clrData = await loveroomModel.findOne({
				userID: uid
			});
			if (clrData) {
				loveroomId = clrData.loveroomID;
				if (!(loveroomId == 0)) {
					clrResponce = await loveroomModel.updateOne({
						userID: uid,
					}, {
						$set: {
							loveroomID: 0,
							loveroomTimestamp: 0,
							loveroomLastpayment: 0
						}
					});

					clrResponce = await loveroomModel.updateOne({
						userID: userMarriage,
					}, {
						$set: {
							loveroomID: 0,
							loveroomTimestamp: 0,
							loveroomLastpayment: 0
						}
					});

					bot.channels.cache.get(loveroomId).delete();
				}
			}
		}

		//удалять клан или убирать юзера из клана
		let userClan = profileData.clan;
		if (userClan != -1) {
			ownClanData = await clanModel.findOne({
				userID: uid
			})
			if (ownClanData) {
				let clanMembers = ownClanData.members;
				let clanOfficers = ownClanData.officers;
				let clanRoleId = ownClanData.clanRole;
				let clanName = ownClanData.name;
				let clanChat = clanData.clanChat;
				let clanVoice = clanData.clanVoice;

				bot.guilds.cache.get(config.serverId).roles.cache.get(clanRoleId).delete();

				bot.channels.cache.get(clanChat).delete();
				bot.channels.cache.get(clanVoice).delete();

				clanDeleteResponce = await clanModel.deleteOne({
					userID: uid
				});

				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						clan: "Нет"
					}
				});

				if (clanMembers.length > 0) {
					clanMembers.forEach(async user => {
						try {
							profileData = await profileModel.updateOne({
								userID: user.memberID,
							}, {
								$set: {
									clan: "Нет"
								}
							});
						} catch (err) {
							if (err.name === "ReferenceError")
								console.log("У вас ошибка")
							console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
						}
					})
				}
				if (clanOfficers.length > 0) {
					clanOfficers.forEach(async user => {
						try {
							profileData = await profileModel.updateOne({
								userID: user.memberID,
							}, {
								$set: {
									clan: "Нет"
								}
							});
							bot.guilds.cache.get(config.serverId).members.cache.get(user.memberID).roles.remove(config.clanOfficerRole);
						} catch (err) {
							if (err.name === "ReferenceError")
								console.log("У вас ошибка")
							console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
						}
					})
				}
			} else {
				clanData = await clanModel.findOne({
					clanID: userClan
				});
				let clanName = clanData.name;
				let membersArray = clanData.members;
				let officersArray = clanData.officers;

				let indexMember = membersArray.findIndex(x => x.memberID === uid);
				let indexOfficer = officersArray.findIndex(x => x.memberID === uid);

				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						clan: "Нет"
					}
				});

				if (indexMember > -1) {
					membersArray.splice(indexMember, 1);
					clanData = await clanModel.updateOne({
						name: clanName,
					}, {
						$set: {
							members: membersArray
						}
					});
				} else {
					officersArray.splice(indexOfficer, 1);
					clanData = await clanModel.updateOne({
						name: clanName,
					}, {
						$set: {
							officers: officersArray
						}
					});
				}

				bot.channels.cache.find(ch => ch.name == clanName && ch.type == 'voice').permissionOverwrites.get(uid).delete();
				bot.channels.cache.find(ch => ch.name == clanName && ch.type == 'text').permissionOverwrites.get(uid).delete();
			}
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}

});

//делать что-то при ВХОДЕ юзера на сервер
bot.on('guildMemberAdd', async member => {
	try {
		//выкинуть юзера с сервера, если аккаунт создан меньше 30 дней назад
		if (member.user.createdTimestamp > Date.now() - (1000 * 60 * 60 * 24 * 30)) {
			let accountKick = new Discord.MessageEmbed()
				.setColor(config.defaultColor)
				.setTitle("⸝⸝ ♡₊˚ Teiko◞")
				.setDescription(`Вы были кикнуты с сервера **Teiko 🩸**\n\nПричина: к сожалению, Ваш аккаунт был создан менее 30 дней назад.\n\nЕсли у Вас есть какие-либо вопросы - обратитесь к [bulokys#9977](https://discordapp.com/users/921741284824211486)`)
				.setTimestamp();
			bot.users.cache.get(member.user.id).send().then(() => {
				bot.channels.cache.get('').send(`${member.user} возможно чейто твинк!`)
			});
			return;
		}
		//чекнуть не бот ли юзер, чтобы лишний раз не засирать БД
		if (member.user.bot) return;
		let uid = member.id;
		//создание основного профиля
		//чек есть ли профиль
		profileData = await profileModel.findOne({
			userID: member.id
		});
		//создание основного профиля
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: -1,
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			//сохранение записи
			profile.save();
		}

		//отправить сообщение в чат, при входе нового юзера
		//NOTE: сделать отправку сообщения, только при нажатии на реакцию верификации
		let welcomeUserDM = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle("⸝⸝ ♡₊˚ Добро пожаловать на Teiko・\🩸◞")
			.setDescription('`' + `${member.user.username}` + '`' + `, спасибо, что зашёл к нам! 💖\n\nДля начала пройди **верификацию** в канале [тык]()\nТебе всего лишь нужно **нажать** на реакцию `)
			.setImage('')
			.setTimestamp();
		bot.users.cache.get(member.user.id).send(welcomeUserDM)
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

//chat log
bot.on('messageDelete', async message => {
	try {
		if (message.author.bot) return;
		let deletedMessage = new Discord.MessageEmbed()
			.setTitle("Сообщение удалено:")
			.setColor(config.defaultColor)
			.setDescription(`**Содержание сообщения:** ${message.content} \n**Отправитель:** ${message.author.tag} (${message.author.id})`)
			.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({ format: "png", dynamic: true })}`)
			.setTimestamp(message.createdAt)
		bot.channels.cache.get(config.chatLogChannel).send(deletedMessage);
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.on('message', async message => {
	try {
		const isInvite = async (guild, code) => {
			return await new Promise((resolve) => {
				guild.fetchInvites().then((invites) => {
					for (const invite of invites) {
						if (code === invite[0]) {
							resolve(true)
							return
						}
					}
					resolve(false)
				})
			})
		}
		const {
			guild,
			member,
			content
		} = message

		const code = content.split('discord.gg/')[1]

		if (content.includes('discord.gg/')) {
			const isOurInvite = await isInvite(guild, code)
			if (!isOurInvite) {
				let antiad = new Discord.MessageEmbed()
					.setColor(config.warnColor)
					.setTitle("🛑 РЕКЛАМА 🛑")
					.setDescription(`Пользователь ${message.author} (id: ${message.author.id}) отправил ссылку на другой сервер (${message})`)
					.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				bot.channels.cache.get(config.chatLogChannel).send(antiad);
				message.delete();
			}
		}
		if (message.author.bot) return;
		if (message.channel.type == "dm") return;
		let uid = message.author.id;
		let msgAuthor = message.author;
		profileData = await profileModel.findOne({
			userID: uid
		});
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: -1,
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			profile.save();
		}
		//чек есть ли профиль войс актива
		vctimeData = await vctimeModel.findOne({
			userID: member.id
		});
		//создание профиля войс актива
		if (!vctimeData) {
			let vctime = await vctimeModel.create({
				userID: uid,
				vctime: 0,
			});
			//сохранение записи
			vctime.save();
		}
		//выдавать роль darkness
		const now = new Date();
		if ((now.getUTCHours() >= 20 && now.getUTCHours() <= 24) || (now.getUTCHours() >= 0 && now.getUTCHours() <= 6)) {
			if (!message.member.roles.cache.has(config.darknessRole)) {
				message.member.roles.add(config.darknessRole);
			}
		}

		//добавить коины при отправке сообщений
		if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel) {
			let userClan = -1;
			userClan = profileData.clan;
			let clanCoinBoost = 1;
			let clanLvlBoost = 1;
			if (userClan == -1) {
				clanData = await clanModel.findOne({
					clanID: userClan
				});
				if (clanData) {
					clanCoinBoost = clanData.coinMultiply;
					clanLvlBoost = clanData.lvlMultiply;
				}
			}
			profileData = await profileModel.findOne({
				userID: uid
			});
			if (profileData) {
				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$inc: {
						msgs: 1,
						msgsForCoinGet: 1,
						xp: 1 * clanLvlBoost
					}
				});
			}

			profileData = await profileModel.findOne({
				userID: uid
			});
			let userXP = profileData.xp;
			let userLvl = profileData.lvl;
			let msgsForCoinGet = profileData.msgsForCoinGet;

			if (userXP >= 100 * userLvl) {
				xpAddResponce = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						xp: 0
					},
					$inc: {
						lvl: 1
					}
				});
			}
			if (msgsForCoinGet >= 3) {
				coinAddResponce = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						msgsForCoinGet: 0
					},
					$inc: {
						silverCoins: 1 * clanCoinBoost
					}
				});
			}
		}
		//Чат-бот Teiko | Версия 1.0
		let mUser = message.guild.member(message.mentions.users.first());
		const answerForUser = ["Я не хочу с тобой говорить.", "Не пингуй меня, я просто бот.", "Не нужно меня пинговать!", "Не пингуй меня, все вопросы к моему создателю.", "Не трогай меня, я просто бот.", "Отстань. Я просто бот. Я не могу с тобой общаться.", "Не. Пингуй. Меня. Я. Занят!!!", "Слушай, я всего лишь бот. Я всем это много раз говорил. Не нужно пытаться со мной общаться.", "Я занят тем, что обрабатываю ваши команды. Не нужно меня пинговать."];
		const answerForCreator = ["Залезь в код и посмотри! Какие ко мне-то вопросы?", "Хватит меня пинговать, чел!", "Ты сам накосячил, а теперь с меня что-то просишь.", "Не нужно меня пинговать, пожалуйста, это раз.\nИ я не знаю, это два. Все вопросы к тебе.", "Все вопросы к тебе и твоему коду, а не ко мне.", "Я всего лишь машина, которая выполняет твои команды ♥", "Я не понимаю, что ты хочешь от меня? Ты меня написал, а теперь жалуешься?"];
		const answerForToxic = ["Добра и по-зи-ти-ва!", "Ничего.", "У тебя всё в порядке?", "Ты пытаешься нагрубить боту?", "Я, конечно, всё понимаю, но так писать боту...", "Надеюсь, что у тебя всё будет хорошо.", "Ты же понимаешь, что я просто бездушная машина, которая отвечает по заранее заданным алгоритмам? А... Ты тоже...", "Повтори ещё раз, пожалуйста, не понял.", "Бип-буп-бип, ошибка. Пользователь пытается писать чушь боту.", "Не понял твоего вопроса. Давай ещё разок.", "Даже не пытайся.", "Ты пытаешься оскорбить этим меня или себя?"];
		const answerForLove = ["<3", "♥", "😘", "цём :3", "чмок в ушко :*", "💕", "💚", "💛", "🧡", "Люблю тебя <3"];
		const answerForExcuse = ["Извинения приняты.", "Прощаю, кожаный мешок с костями.", "Нет тебе прощенья.", "Ага.", "Не прощу!", "Прощаю <3", "Хорошо. На этот раз прощу тебя.", "Извиняю.", "Нет.", "Прощаю."];
		const answerForClan = ["Команды для создания клана ты можешь найти написав `.clan help`", "Информацию о кланах ты можешь узнать написав `.clan help`"];
		const answerForPR = ['Чтобы создать закрытую комнату - зайди в голосовой канал <#948942630883061811> и твоя комната будет создана в момент. Все команды личных комнат ты сможешь посмотреть, если напишешь `.vc`!']
		const answerForLoveRoom = ["Для того, чтобы создать любовную комнату - тебе нужно заключить брак и написать `.clr`."];
		const answerForCommands = ["Все команды сервера ты можешь узнать написав `.help`", "Ты сможешь получить лист команд написав `.help`", "Я отправлю тебе лист команд, если ты напишешь `.help`"];
		const answerForFeatures = ["Сервер Teiko - это обширный проект, который обдумывался ооочень долгое время. Главной фишкой сервера являюсь я - бот Teiko.. Если ты хочешь найти себе тут место, то обязательно заходи в голосовые каналы и чаты! Хочешь узнать лист всех команд сервера, чтобы узнать что-то новое? Напиши `.help`!"];
		const answerForEvents = ["На сервере проводятся различные мероприятия. Начиная от розыгрышей серверной валюты или игр в мафию и т.п., до соревнований в CS:GO, Valorant и разных других игр. Обязательно следи за нашими обновлениями, чтобы всегда быть вкурсе!"];
		const answerForReact = ["Все команды реакций ты можешь узнать написав `.rlist`", "Ты сможешь получить лист доступных реакций написав `.rlist`", "Я отправлю тебе лист реакций, если ты напишешь `.rlist`"];
		const didntGetQuest = ["Так... Прости, но я не понял твоего вопроса. Попробуй задать его по-другому.", "Извини, не понял, что ты хотел узнать. Попробуй спросить иначе.", "Извини, я не расслышал. Попробуй сказать иначе.", "Простите, что? Я просто бот и иногда не понимаю, что вы хотите спросить.", "У меня небольшие проблемы с пониманием человеческого языка. Попробуй спросить иначе.", "Извини, пожалуйста, но я ничего не понял. Попробуй задать мне вопрос иначе.", "Извини, ты используешь слишком сложные слова. Попробуй по-другому!"];
		const answerForRude = ["Перечитай правила, друг.", "Не груби.", "Давай без грубостей.", "Не нужно так.", "Перестань грубить."];
		const answerForRoles = ["Информацию о ролях ты можешь найти в <#948888758542032978>", "Интересно узнать про роли на сервере? <#948888758542032978>", "Вся информация о ролях на сервере <#948888758542032978>", "Все роли тут: <#948888758542032978>"];
		const answerForHRU = ["Отлично!", "Всё хорошо!", "Всё отлично! Занимаюсь тем, что обрабатываю ваши команды.", "Супер!", "Бип-буп-бип... *звуки печати* Всё хорошо, кожаный мешок с костями!"];
		const answerForWhereCommands = ["Для команд у нас есть отдельный чат <#948511674569220106>", "Писать команды сюда: <#948511674569220106>"];
		const answerForAboutMe = ["Ещё раз привет, друг! Меня зовут `Teiko.`! Я один из лучших ботов, потому что только я имею чувства и всегда стараюсь Вам помочь. Меня разработал и до сих пор поддерживает averly. В каком-то смысле, я - его ребёнок. Всю информацию о том, что я умею и какие команды воспринимаю Вы сможете найти, если напишите команду `.help`."]
		const answerForSelfie = ["Свои фото вы можете отправлять в чат <#948541712287014912>", "Все фотографии пользователей храняться тут: <#948541712287014912>"];
		if (mUser) {
			if (mUser.id == bot.user.id) {
				let mtl = message.content.toLowerCase();
				if (mtl.includes("как ") || mtl.includes("каким ")) {
					if (mtl.includes("создать") || mtl.includes("сделать") || mtl.includes("открыть") || mtl.includes("образовать") || mtl.includes("открыть") || mtl.includes("заделать") || mtl.includes("зделать")) {
						if (mtl.includes("клан") || mtl.includes("семью") || mtl.includes("гильдию") || mtl.includes("гильдия") || mtl.includes("семья")) {
							message.channel.send(answerForClan[Math.floor(Math.random() * answerForClan.length)]);
						} else if (mtl.includes("приватку") || mtl.includes("приватка") || mtl.includes("комната") || mtl.includes("комнату") || mtl.includes("приватную") || mtl.includes("личная") || mtl.includes("личную") || mtl.includes("комнаты") || mtl.includes("личные") || mtl.includes("закрытую")) {
							message.channel.send(answerForPR[Math.floor(Math.random() * answerForPR.length)]);
						} else if (mtl.includes("лавку") || mtl.includes("лавруму") || mtl.includes("лав руму") || mtl.includes("любовную комнату") || mtl.includes("любовную") || mtl.includes("любовная") || mtl.includes("лав")) {
							message.channel.send(answerForLoveRoom[Math.floor(Math.random() * answerForLoveRoom.length)]);
						}
					} else if (mtl.includes("дела")) {
						message.channel.send(answerForHRU[Math.floor(Math.random() * answerForHRU.length)])
					} else {
						message.channel.send(didntGetQuest[Math.floor(Math.random() * didntGetQuest.length)]);
					}
				} else if (mtl.includes("прости") || mtl.includes("извини") || mtl.includes("извиняй") || mtl.includes("прощения") || mtl.includes("прощенья") || mtl.includes("извиняюсь") || mtl.includes("сори") || mtl.includes("сорри")) {
					message.channel.send(answerForExcuse[Math.floor(Math.random() * answerForExcuse.length)]);
				} else if (mtl.includes("куда")) {
					if (mtl.includes("команд")) {
						message.channel.send(answerForWhereCommands[Math.floor(Math.random() * answerForWhereCommands.length)]);
					} else if (mtl.includes("селфи") || mtl.includes("сэлфи") || mtl.includes("фото") || mtl.includes("фотки")) {
						message.channel.send(answerForSelfie[Math.floor(Math.random() * answerForSelfie.length)]);
					} else {
						message.channel.send(didntGetQuest[Math.floor(Math.random() * didntGetQuest.length)]);
					}
				} else if (mtl.includes("что") || mtl.includes("какие") || mtl.includes("чо") || mtl.includes("чем") || mtl.includes("какое") || mtl.includes("какой") || mtl.includes("шо")) {
					if (mtl.includes("команды")) {
						message.channel.send(answerForCommands[Math.floor(Math.random() * answerForCommands.length)]);
					} else if (mtl.includes("фишки") || mtl.includes("делать") || mtl.includes("заниматься") || mtl.includes("заняться") || mtl.includes("есть")) {
						message.channel.send(answerForFeatures[Math.floor(Math.random() * answerForFeatures.length)]);
					} else if (mtl.includes("ивенты") || mtl.includes("мероприятия") || mtl.includes("ивент") || mtl.includes("мероприятие")) {
						message.channel.send(answerForEvents[Math.floor(Math.random() * answerForEvents.length)]);
					} else if (mtl.includes("реакции") || mtl.includes("реакция")) {
						message.channel.send(answerForReact[Math.floor(Math.random() * answerForReact.length)]);
					} else if (mtl.includes("маме") || mtl.includes("папе") || mtl.includes("матери") || mtl.includes("отцу") || mtl.includes("в хуй") || mtl.includes("скажешь") || mtl.includes("деду") || mtl.includes("мать") || mtl.includes("бабке") || mtl.includes("бабушке") || mtl.includes("котику") || mtl.includes("собачке")) {
						message.channel.send(answerForToxic[Math.floor(Math.random() * answerForToxic.length)]);
					} else {
						message.channel.send(didntGetQuest[Math.floor(Math.random() * didntGetQuest.length)]);
					}
				} else if (mtl.includes("еблан") || mtl.includes("лох") || mtl.includes("придурок") || mtl.includes("заебал") || mtl.includes("сука") || mtl.includes("папа") || mtl.includes("мать") || mtl.includes("отец") || mtl.includes("мама") || mtl.includes("маме") || mtl.includes("папе") || mtl.includes("отцу") || mtl.includes("матери") || mtl.includes("мамке") || mtl.includes("папе") || mtl.includes("бате") || mtl.includes("батье") || mtl.includes("хуй") || mtl.includes("хуя") || mtl.includes("уебан") || mtl.includes("уёбок") || mtl.includes("уебок") || mtl.includes("пизда") || mtl.includes("пизды") || mtl.includes("попущь") || mtl.includes("затролен") || mtl.includes("затроллен") || mtl.includes("слился") || mtl.includes("слит") || mtl.includes("слитый") || mtl.includes("идиот") || mtl.includes("тупой") || mtl.includes("мудак") || mtl.includes("дурак") || mtl.includes("даун") || mtl.includes("гей") || mtl.includes("пидор")) {
					message.channel.send(answerForRude[Math.floor(Math.random() * answerForRude.length)]);
				} else if (mtl.includes("♥") || mtl.includes("❤") || mtl.includes("<3") || mtl.includes("я тебя люблю") || mtl.includes("хороший") || mtl.includes("😘")) {
					message.channel.send(answerForLove[Math.floor(Math.random() * answerForLove.length)]);
				} else if (mtl.includes("модер") || mtl.includes("админ") || mtl.includes("овнер") || mtl.includes("владел") || mtl.includes("роль") || mtl.includes("роли")) {
					message.channel.send(answerForRoles[Math.floor(Math.random() * answerForRoles.length)]);
				} else if (mtl.includes("о себе")) {
					message.channel.send(answerForAboutMe[Math.floor(Math.random() * answerForAboutMe.length)]);
				} else {
					message.channel.send(didntGetQuest[Math.floor(Math.random() * didntGetQuest.length)]);
				}
			}
		}
		//Ставить реакцию на сообщение с фотографией в чате селфи
		//И удалять сообщения без фотографий
		if (message.channel.id == config.selfiesChannel && !message.author.bot) {
			if (message.attachments.size <= 0) {
				message.delete();
			} else {
				message.react("💘")
			}
		}
		//Ставить реакцию на сообщение в творчество
		if (message.channel.id == config.creativeChat && !message.author.bot) {
			message.react("💜");
		}
		repWords.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					profileData = await profileModel.updateOne({
						userID: uid,
					}, {
						$inc: {
							reputation: 2,
						}
					});
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		minusRepWorld.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					profileData = await profileModel.updateOne({
						userID: uid,
					}, {
						$inc: {
							reputation: -5,
						}
					});
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		//реакция на сообщение добро пожаловать
		helloWords.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					message.react("💖");
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		//разная дичь
		let messageArray = message.content.split(" ");
		let command = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);
		if (!message.content.startsWith(prefix)) return;
		let cmd = bot.commands.get(command.slice(prefix.length));
		if (cmd) cmd.run(bot, message, args, profileData);

		//знак отличия
		profileData = await profileModel.findOne({
			userID: uid
		});
		let achieve = profileData.achievements;
		let userMsgs = profileData.msgs;
		let rUser = message.author;
		if (userMsgs >= 10000) {
			const exclsName = `"Клавишник"`;
			const exclsEmoji = "🎹";

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
					$set: {
						achievements: achieveNew
					}
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

	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.on('voiceStateUpdate', async (oldState, newState) => {
	try {
		if (newState.member.user.bot) return;

		let uid = newState.member.user.id;

		//чек есть ли профиль для приваток
		pvcData = await pvcModel.findOne({
			userID: uid
		});
		//создание профиля для приваток
		if (!pvcData) {
			let pvc = await pvcModel.create({
				userID: uid,
				ownvc: 0,
			});
			//сохранение записи
			pvc.save();
		}
		//чек есть ли профиль
		profileData = await profileModel.findOne({
			userID: uid
		});
		//создание основного профиля
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: -1,
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			//сохранение записи
			profile.save();
		}
		//создание профиля для войсактива
		profileData = await profileModel.findOne({
			userID: uid
		});
		let userCoins = profileData.silverCoins;
		pvc = await pvcModel.findOne({
			userID: uid
		});
		let ownvc = pvc.ownvc;

		// const seconds = Math.floor((uvc.vctime / 1000) % 60);
		// const minutes = Math.floor((uvc.vctime / 1000 / 60) % 60);
		// const hours = Math.floor((uvc.vctime / 1000 / 60 / 60) % 24);
		// const days = Math.floor(uvc.vctime / 1000 / 60 / 60 / 24);
		//
		//---приватные комнаты---
		//
		if (newState.channelID == config.createChannelId) { //проверка на заход в канал создания румы
			//создание самой румы, сделать лимит в 1 человека и позволить владельцу видеть канал
			//кикнуть, если нет бабок
			if (userCoins < prCost) {
				newState.setChannel(null);
				let errorCoins = new Discord.MessageEmbed()
					.setColor(`${config.errColor}`)
					.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
					.setDescription(`У Вас недостаточно средств для создания приватной комнаты.\nВаш баланс: ${userCoins} ${config.silverCoin}\nСтоимость приватной комнаты ${prCost} ${config.silverCoin}`)
					.setTimestamp();
				bot.users.cache.get(newState.member.user.id).send(errorCoins);
				return;
			} else {
				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$inc: {
						silverCoins: -prCost
					}
				});
				profileData = await profileModel.findOne({userID: uid});
				let userCoins = profileData.silverCoins;
				let vcCreate = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
					.setDescription(`C Вас было списано ${prCost} ${config.silverCoin} за создание приватной комнаты.\nВаш баланс: ${userCoins - prCost} ${config.silverCoin}`)
					.setTimestamp();
				bot.users.cache.get(newState.member.user.id).send(vcCreate);

				newState.guild.channels.create(oldState.member.user.username, {
					type: 'voice',
					userLimit: 1,
					parent: config.createChannelCategory,
					permissionOverwrites: [{
						id: newState.id,
						allow: ['VIEW_CHANNEL']
					}, {
						id: config.nonverifiedUserRole,
						deny: ['VIEW_CHANNEL']
					}]
				}).then(
					async c => {
						try {
							//переместить участника
							newState.setChannel(c);
							//присвоить айди созданного канала к профайлу
							newOwnvcID = `${bot.channels.cache.find(channel => channel.name === newState.member.user.username).id}`;
							pvcResponce = await pvcModel.updateOne({
								userID: uid,
							}, {
								$set: {
									ownvc: newOwnvcID
								}
							});
						} catch (err) {
							console.warn(err);
						}
					}
				)
			}
		}
		//если владелец канала выходит с него, то удалить канал
		if (oldState.channel != null) {
			if (oldState.channel.members.size <= 0 && config.createChannelCategory == oldState.channel.parentID && oldState.channel.id != config.createChannelId) {
				bot.channels.cache.find(ch => ch.id == oldState.channel.id).delete();
			}
		}
		const category = await bot.channels.cache.get(config.createChannelCategory);
		category.children.forEach(channel => {
			if (channel.members.size <= 0 && channel.id != config.createChannelId) {
				channel.delete()
			}
		});
		//удаление голосового канала ивента, если он пуст:
		if (oldState.channel != null) {
			if (oldState.channel.members.size <= 0 && config.eventCategory == oldState.channel.parentID) {
				bot.channels.cache.find(ch => ch.id == oldState.channel.id).delete();
			}
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});
process.on('unhandledRejection', (reason) => { console.log(reason) })
bot.login(token);
const disbut = require('discord-buttons')
disbut(bot)
