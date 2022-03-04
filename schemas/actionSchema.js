const mongoose = require('mongoose');
const config = require('../botconfig.json');

const actionSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	inAction: {type: Number},
});

const model = mongoose.model("ActionSchema", actionSchema);

module.exports = model;