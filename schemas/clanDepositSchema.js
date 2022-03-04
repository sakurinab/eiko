const mongoose = require('mongoose');
const config = require('../botconfig.json');

const clanDepositSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	deposed: {type: Number},
	lastDepose: {type: Number},
});

const model = mongoose.model("ClanDepositSchema", clanDepositSchema);

module.exports = model;