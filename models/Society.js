var mongoose = require("mongoose");

societySchema = new mongoose.Schema({
    presidentId: String,
    id: String,
    name: String
});

module.exports = mongoose.model("societySchema", societySchema);
