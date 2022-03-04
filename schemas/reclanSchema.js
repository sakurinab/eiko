const mongoose = require('mongoose');
const config = require('../botconfig.json');

const reclanSchema = new mongoose.Schema({
	clanID: {type: Number},
	ownerID: {type: String},
	creationDate: {type: Number},
	members: {type: [Object]},
	officers: {type: [Object]},
	balance: {type: Number},
	description: {type: String},
	lvlMultiply: {type: Number},
	coinMultiply: {type: Number},
	bannerLink: {type: String},
	name: {type: String},
	level: {type: Number},
	xp: {type: Number},
	prize: {type: Number},
	roleID: {type: String},
	symbols: {type: String},
	slots: {type: Number},
	chatID: {type: String},
	voiceID: {type: String},
	lastBomb: {type: Number},
	lastRob: {type: Number},
	lastTrap: {type: Number},
	underAttack: {type: Boolean},
});

const model = mongoose.model("ReclanSchema", reclanSchema);

module.exports = model;