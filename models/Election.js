var mongoose = require("mongoose");

electionSchema = new mongoose.Schema({
    id: String,
    prepareTime: Number,
    startTime: Number,
    endTime: Number,
    position: String,
    totalVotes: Number,
    societies: []
});

//MODEL
module.exports = mongoose.model("electionSchema", electionSchema);