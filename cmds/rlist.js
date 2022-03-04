const Discord = require('discord.js');
const fs = require('fs');
let config = require('../botconfig.json');
module.exports.run = async (bot,message,args) => {
try{
	
	let rUser = message.author;

	if (message.channel.id == config.mainChannel || message.channel.id == config.toxicChannel || message.channel.id == config.selfiesChannel) {
        bot.channels.cache.get(config.floodChannel).send(`Ещё раз привет, ${rUser}! Ты не можешь отправлять команды в общие чаты для общения! Для этого есть чат <#${config.floodChannel}>!`);
        message.delete();
        return;
    }

	let reactEmd = new Discord.MessageEmbed()
	.setColor(`${config.defaultColor}`)
	.setTitle("⸝⸝ ♡₊˚ Лист реакций◞")
	.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
	.setDescription(`**.sleep** - лечь спать\n**.hide** - спрятаться\n**.smoke** - закурить сигаретку\n**.dance** - танцевать\n**.depression** - впасть в депрессию\n**.cry** - расплакаться\n**.sad** - грустить\n**.angry** *[@пользователь]* - разозлиться\n**.shoot** *[@пользователь]* - выстрелить\n**.cheek** *[@пользователь]* - поцеловать в щёчку\n**.lick** *[@пользователь]* - облизать\n**.slap** *[@пользователь]* - дать пощёчину\n**.nom** *[@пользователь]* - покормить\n**.hit** *[@пользователь]* - ударить\n**.bite** *[@пользователь]* - укусить\n**.pat** *[@пользователь]* - погладить\n**.poke** *[@пользователь]* - тыкнуть\n**.hug** *[@пользователь]* - обнять\n**.virt** *[@пользователь]* - повиртить\n**.love** *[@пользователь]* - признаться в любви\n**.kiss** *[@пользователь]* - поцеловать`)
	.setTimestamp();

	bot.users.cache.get(rUser.id).send(reactEmd);
}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	};
};

module.exports.help = {
	name: "rlist"
};