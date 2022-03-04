const mongoose = require('mongoose');
const config = require('../botconfig.json');

const giveAwaySchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	time: {type: Number},
});

const model = mongoose.model("GiveAwaySchema", giveAwaySchema);

module.exports = model;