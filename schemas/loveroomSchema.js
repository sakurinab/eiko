const mongoose = require('mongoose');
const config = require('../botconfig.json');

const loveroomSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	loveroomID: {type: Number},
	loveroomTimestamp: {type: Number},
	loveroomLastpayment: {type: Number}
});

const model = mongoose.model("LoveroomSchema", loveroomSchema);

module.exports = model;