var mongoose = require("mongoose");

voterSchema = new mongoose.Schema({
    cgpa: Number,
    password : String,
    semester: Number,
    hasVoted: Boolean,
    studentId: String,
    voteId : String,
    notification : [],
    name: String

});

//MODEL
module.exports = mongoose.model("voterSchema", voterSchema);