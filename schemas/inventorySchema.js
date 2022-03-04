const mongoose = require('mongoose');
const config = require('../botconfig.json');

const inventorySchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	invRoles: {type: [Object]},
	invEmoji: {type: [Object]},
	eqEmoji: {type: Number},
});

const model = mongoose.model("InventorySchema", inventorySchema);

module.exports = model;