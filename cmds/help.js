const Discord = require('discord.js');
const fs = require('fs');
const Teiko = require('../package.json');
const config = require('../botconfig.json');
const pagination = require('discord.js-pagination');

module.exports.run = async (bot, message, args) => {
    try {
        
        let rUser = message.author;
        let uid = message.author.id;

        if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
            bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
            message.delete();
            return;
        }

        var help1 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Приватные комнаты ---` + '`\n' + `**.vc lock** - закрыть комнату\n**.vc unlock** - открыть комнату\n**.vc name <имя комнаты>** - установить имя комнаты\n**.vc limit <0-99>** - установить лимит участников в комнате\n**.vc invite <@пользователь>** - пригласить пользователя в комнату\n**.vc kick <@пользователь>** - кикнуть пользователя из комнаты\n**.vc ban <@пользователь>** - забанить пользователя в комнате\n**.vc unban <@пользователь>** - разбанить пользователя в комнате\nСтраница 1/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help2 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Экономика ---` + '`\n' + `**.transfer <@пользователь> <кол-во серебра>** - перевести серебро пользователю\n**.casino => .cc <ставка>** - казино\n**.convert => .conv <кол-во золота>** - конвертация золота в серебро\n**.daily** - получить ежедневный бонус\nСтраница 2/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help3 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Магазины ---` + '`\n' + `**.roleshop => .rs** - магазин ролей\n**.emojishop => .es** - магазин эмоджи для Вашего профиля\n**.equip => .eq <role/emoji> <индекс>** - надеть роль/эмоджи\n**.unequip => .uneq <role/emoji> <индекс>** - снять роль/эмоджи\n**.inventory => .inv <role/emoji>** - посмотреть инвентарь ролей/эмоджи\nСтраница 3/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help4 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Профиль ---` + '`\n' + `**.profile => .p** - посмотреть свой профиль\n**.profile => .p banner <ссылка>** - установить баннер профиля\n**.profile => .p status <статус>** - установить статус в профиле\n**.profile => .p line <#HEX цвет>** - указать цвет линии профиля\n**.profile => .p help** - команды профиля\nСтраница 4/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help5 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Другое ---` + '`\n' + `**.8ball <вопрос>** - магический шар ответов\n**.flip** - не знаешь какое решение принять? Подкинь монетку!\n**.roll <@пользователь> <ставка>** - поиграть в кости с пользователем\n**.avatar => .av [@пользователь]** - посмотреть аватар пользователя\n**.Teiko** - информация о боте\n**.topch** - топ по чату\n**.topd** - топ по ежедневным наградам\n**.topgold** - топ по балансу золота\n**.toplvl** - топ по уровню\n**.topm** - топ по балансу серебра\n**.topvc** - топ по времени в голосовых каналах\n**.code <код>** - активировать подарочный код\nСтраница 5/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help6 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Браки ---` + '`\n' + `**.marry <@пользователь>** - предложить пользователю заключить брак\n**.divorce** - расторгнуть брак\n**.createloveroom => .clr** - создать любовную комнату\n**.deleteloveroom => .dlr** - удалить любовную комнату\nСтраница 6/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help7 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Реакции ---` + '`\n' + `**.rlist** - лист реакций\n**.sleep** - лечь спать\n**.hide** - спрятаться\n**.smoke** - закурить сигаретку\n**.dance** - танцевать\n**.depression** - впасть в депрессию\n**.cry** - расплакаться\n**.sad** - грустить\n**.angry [@пользователь]** - разозлиться\n**.shoot [@пользователь]** - выстрелить\n**.cheek [@пользователь]** - поцеловать в щёчку\n**.lick [@пользователь]** - облизать\n**.slap [@пользователь]** - дать пощёчину\n**.nom [@пользователь]** - покормить\n**.hit [@пользователь]** - ударить\n**.bite [@пользователь]** - укусить\n**.pat [@пользователь]** - погладить\n**.poke [@пользователь]** - тыкнуть\n**.hug [@пользователь]** - обнять\n**.virt [@пользователь]** - повиртить\n**.love [@пользователь]** - признаться в любви\n**.kiss [@пользователь]** - поцеловать\nСтраница 7/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        var help8 = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("⸝⸝ ♡₊˚ Команды сервера◞")
        .setDescription('`' + `--- Кланы ---` + '`\n' + `**.clan** - информация о клане\n**.clan help** - данное сообщение\n**.clan create** <название клана> - создать клан за 50000 ${config.silverCoin}\n**.clan delete** - удалить клан\n**.clan invite <@пользователь>** - пригласить пользователя в клан\n**.clan kick <@пользователь>** - выгнать пользователя из клана\n**.clan leave** - покинуть клан\n**.clan officer <@пользователь>** - назначить/убрать пользователя на/с должность(-и) офицер(-а)\n**.clan deposit <1-15000>** - пополнить счёт клана\n**.clan color <hex>** - установить цвет клана за 5000 ${config.silverCoin}\n**.clan symbol <emoji>** - установить символ(ы) клана за 15000 ${config.silverCoin}\n**.clan description <описание>** - установить описание клана за 5000 ${config.silverCoin}\n**.clan banner <ссылка>** - установить баннер клана за 30000 ${config.silverCoin}\n**.clan rename <название клана>** - переименовать клан за 10000 ${config.silverCoin}\n**.clan perks** - посмотреть возможные улучшения для клана и их цены\n**.clan upgrade <индекс>** - улучшить клан\n**.clan bomb <название клана>** - заложить бомбу в клане\n**.clan rob <название клана>** - ограбить клан\n**.clan top** - топ кланов\nСтраница 8/8`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        const pages = [
            help1,
            help2,
            help3,
            help4,
            help5,
            help6,
            help7,
            help8
        ];
        const emoji = ["⏪", "⏩"];
        const timeout = '60000';
        pagination(message, pages, emoji, timeout);
    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "help",
    alias: "?"
};