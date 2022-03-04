const mongoose = require('mongoose');
const config = require('../botconfig.json');

const clanSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	clanCreateDate: {type: Number},
	members: {type: [Object]},
	officers: {type: [Object]},
	balance: {type: Number},
	description: {type: String},
	lvlMultiply: {type: Number},
	coinMultiply: {type: Number},
	banner: {type: String},
	name: {type: String},
	level: {type: Number},
	xp: {type: Number},
	prize: {type: Number},
	clanRole: {type: String},
	clanSign: {type: String},
	clanSlots: {type: Number},
	clanChat: {type: String},
	clanVoice: {type: String},
	lastBomb: {type: Number},
	lastRob: {type: Number},
	underAttack: {type: Number},
	clanId: {type: Number}
});

const model = mongoose.model("ClanSchema", clanSchema);

module.exports = model;