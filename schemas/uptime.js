const mongoose = require('mongoose');
const config = require('../botconfig.json');

const botUptime = new mongoose.Schema({
	name: {type: String},
	uptime: {type: Number},
});

const model = mongoose.model("uptime", botUptime);

module.exports = model;