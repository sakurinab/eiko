const mongoose = require('mongoose');
const config = require('../botconfig.json');

const profileSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	silverCoins: {type: Number},
	goldCoins: {type: Number},
	xp: {type: Number},
	lvl: {type: Number},
	msgs: {type: Number},
	msgsForCoinGet: {type: Number},
	reputation: {type: Number},
	clan: {type: String},
	marriage: {type: String},
	profileStatus: {type: String},
	profileBanner: {type: String},
	profileLine: {type: String},
	achievements: {type: String},
});

const model = mongoose.model("ProfileSchema", profileSchema);

module.exports = model;