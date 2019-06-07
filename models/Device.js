var mongoose = require("mongoose");

devicesSchema = new mongoose.Schema({
    deviceName 		: String,
    deviceId		: String,
    registrationId	: String
});

//MODEL
module.exports = mongoose.model("devicesSchema", devicesSchema);