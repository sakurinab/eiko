const mongoose = require('mongoose');
const config = require('../botconfig.json');

const rbSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	timeout: {type: Number},
	reason: {type: String},
	rbGet: {type: Number},
});

const model = mongoose.model("RbSchema", rbSchema);

module.exports = model;