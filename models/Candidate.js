var mongoose = require("mongoose");

candidateSchema = new mongoose.Schema({
            cgpa: Number,
            semester: Number,
            pastExperience: String,
            password : String,
            totalVotes: Number,
            society : String,
            election: String,
            studentId: String,
            name : String
});
//MODEL
module.exports = mongoose.model("candidateSchema", candidateSchema);