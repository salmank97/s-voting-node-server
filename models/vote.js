var mongoose = require("mongoose");

voteSchema = new mongoose.Schema({
    id: String,
    owner :String
});

//MODEL
module.exports = mongoose.model("voteSchema", voteSchema);