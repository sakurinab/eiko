const mongoose = require('mongoose');
const config = require('../botconfig.json');

const dailySchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	timeout: {type: String},
	dailysget: {type: Number},
	lastdaily: {type: String},
	weekdaily: {type: Number},
});

const model = mongoose.model("DailySchema", dailySchema);

module.exports = model;