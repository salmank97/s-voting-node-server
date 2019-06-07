var mongoose = require("mongoose");

notificationSchema = new mongoose.Schema({
   subject : String,
    message : String
});
//MODEL
module.exports = mongoose.model("notificationSchema", notificationSchema);