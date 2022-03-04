const mongoose = require('mongoose');
const config = require('../botconfig.json');

const pvcSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	ownvc: {type: String},
});

const model = mongoose.model("PvcSchema", pvcSchema);

module.exports = model;