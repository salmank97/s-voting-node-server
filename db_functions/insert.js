var exports = module.exports = {},
    constants = require('../constants'),
    bcrypt = require('bcrypt'),
    OneSignal = require('onesignal-node'),
    axios = require('axios'),
    voterModel = require('../models/Voter'),
    notificationModel = require('../models/Notification'),
    candidateModel = require("../models/Candidate");


// create a new Client for a single app
var myClient = new OneSignal.Client({
    userAuthKey: 'YWNiOGJkNjctNDQwYS00N2YzLThlOWEtZmVmZTYxMTU2ZmE5',
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: 'ZGVlODhkNWQtMWU4ZS00NTFhLWEwNmQtOGIwZDI2NmEwOTRh', appId: '75f4fbb3-59e2-48a6-bacf-06ad7692d3ae' }
});


exports.addNotification = async (user) => {
    try {
        await notificationModel.create(user);
        // we need to create a notification to send
        var firstNotification = new OneSignal.Notification({
            contents: {
                en: user.message
            }
        });

// set target users
        firstNotification.postBody["included_segments"] = ["Active Users"];
        firstNotification.postBody["excluded_segments"] = ["Banned Users"];


        // set notification parameters
        firstNotification.postBody["data"] = {"abc": "123", "foo": "bar"};

        // send this notification to All Users except Inactive ones
        myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
            if (err) {
                console.log('Something went wrong...');
            } else {
                console.log(data, httpResponse.statusCode);
            }
        });

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

//
// exports.addNotification = async (user) => {
//     try {
//         let dbUser = await voterModel.find({studentId: user.studentId});
//         if (constants.isEmpty(dbUser)) {
//             throw new Error(constants.responseMessages.userNotFound)
//         }
//         let notification = {
//             subject: user.subject,
//             description: user.description
//         };
//
//         await voterModel.findOneAndUpdate(
//             { studentId : user.studentId },
//             { $push: { notification : notification  } },
//             );
//
//         return constants.responseMessages.Success;
//
//     } catch (e) {
//         console.log(e);
//         throw new Error(e);
//     }
// };

exports.castVote = async (user) => {
    try {
        let request = await axios.post('http://localhost:3000/api/castVote', {
            voteId: user.voteId,
            voterId: user.voterId,
            candidateId: user.candidateId,
            electionId: user.electionId
        });

        await voterModel.findOneAndUpdate(
            { voteId : user.voteId },
            {$set:{ hasVoted: true }} ,
        );

        return request.data;

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

exports.insertCandidate = async (user) => {
    try {

        let dbUser = await candidateModel.find({studentId: user.studentId});
        if (constants.isEmpty(dbUser)) {
            throw new Error(constants.responseMessages.userNotFound)
        }

        if(dbUser[0].cgpa !== user.cgpa ){
            throw  new Error("Incorrect cgpa")
        }
        if(dbUser[0].semester !== user.semester ){
            throw  new Error("Incorrect semester")
        }

        if(dbUser[0].name !== user.name ){
            throw  new Error("Incorrect Name")
        }


        await axios.post('http://localhost:3000/api/candidate', {
            pastExperience: user.pastExperience,
            society: user.society,
            election: user.election,
            cgpa: parseFloat(user.cgpa),
            semester: user.semester,
            name: user.name,
            id: user.studentId
        });

        let hashOfPassword = await bcrypt.hash(user.password, constants.SALT);

        await candidateModel.findOneAndUpdate(
            { studentId : user.studentId },
            {$set:{pastExperience: user.pastExperience , society : user.society , election : user.election , password : hashOfPassword}} ,
            );

        return {auth: true};

    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
};

exports.insertEligibleStudents = async (candidates) => {
    try {

        for (let i = 0; i < candidates.length; i++) {

            await candidateModel.create({
                cgpa: candidates[i].cgpa,
                semester: candidates[i].semester,
                name: candidates[i].name,
                studentId: candidates[i].id
            });

            await voterModel.create({
                cgpa: candidates[i].cgpa,
                semester: candidates[i].semester,
                name: candidates[i].name,
                studentId: candidates[i].id
            });
        }
        return {auth: true, success: constants.responseMessages.Success};

    } catch (e) {
        console.log(e);
        throw new Error("Server error -- Unable to insert into database");
    }
};

// exports.insertMultipleCandidates = async (candidates) => {
//     try {
//
//         for (let i = 0; i < candidates.length; i++) {
//             let hashOfPassword = await bcrypt.hash(candidates[i].password, constants.SALT);
//
//
//             await axios.post('http://localhost:3000/api/candidate', {
//                 pastExperience: candidates[i].pastExperience,
//                 society: candidates[i].society,
//                 election: candidates[i].election,
//                 cgpa: candidates[i].cgpa,
//                 semester: candidates[i].semester,
//                 name: candidates[i].name,
//                 id: candidates[i].studentId
//             });
//
//             await candidateModel.create({
//                 pastExperience: candidates[i].pastExperience,
//                 society: candidates[i].society,
//                 election: candidates[i].election,
//                 cgpa: candidates[i].cgpa,
//                 password: hashOfPassword,
//                 semester: candidates[i].semester,
//                 name: candidates[i].name,
//                 studentId: candidates[i].studentId
//             });
//         }
//         return {auth: true, success: constants.responseMessages.Success};
//
//     } catch (e) {
//         console.log(e);
//         throw new Error("Server error -- Unable to insert into database");
//     }
// };
//
// exports.insertMultipleVoters = async (voters) => {
//     try {
//         for (let i = 0; i < voters.length; i++) {
//             let hashOfPassword = await bcrypt.hash(voters[i].password, constants.SALT);
//
//             await axios.post('http://localhost:3000/api/Voter', {
//                 cgpa: voters[i].cgpa,
//                 semester: voters[i].semester,
//                 name: voters[i].name,
//                 id: voters[i].studentId
//             });
//
//             let voteId = constants.generateUUID();
//
//             await voterModel.create({
//                 cgpa: voters[i].cgpa,
//                 password: hashOfPassword,
//                 semester: voters[i].semester,
//                 name: voters[i].name,
//                 voteId: voteId,
//                 studentId: voters[i].studentId
//             });
//
//
//             await axios.post('http://localhost:3000/api/vote', {
//                 id: voteId,
//                 owner: "resource:one.xord.svoting.Voter#" + voters[i].studentId
//             });
//         }
//         ;
//         return {auth: true, success: constants.responseMessages.Success};
//
//     } catch (e) {
//         console.log(e);
//         throw new Error("Server error -- Unable to insert into database");
//     }
// };

exports.insertVoter = async (voter) => {
    try {
        let dbUser = await voterModel.find({studentId: voter.studentId});
        if (constants.isEmpty(dbUser)) {
            throw new Error(constants.responseMessages.userNotFound)
        }

        if(dbUser[0].cgpa !== voter.cgpa ){
            throw  new Error("Incorrect cgpa")
        }
        if(dbUser[0].semester !== voter.semester ){
            throw  new Error("Incorrect semester")
        }

        if(dbUser[0].name !== voter.name ){
            throw  new Error("Incorrect Name")
        }

        let voteId = constants.generateUUID();


        await axios.post('http://localhost:3000/api/voter', {
            hasVoted : false,
            cgpa: voter.cgpa,
            semester: voter.semester,
            name: voter.name,
            id: voter.studentId
        });


        await axios.post('http://localhost:3000/api/vote', {
            id: voteId,
            owner: "resource:one.xord.svoting.Voter#" + voter.studentId
        });


        let hashOfPassword = await bcrypt.hash(voter.password, constants.SALT);

        await voterModel.findOneAndUpdate(
            { studentId : voter.studentId },
            {$set:{ password : hashOfPassword , voteId : voteId , hasVoted : false}} ,
        );

        return {auth: true };


    } catch (e) {
        console.log(e);
        throw new Error(e)
    }

};


exports.insertUser = async (user) => {
    if (user.isVoter === true) {
        return await exports.insertVoter(user);
    } else if (user.isCandidate === true) {
        return await exports.insertCandidate(user)
    }
};


exports.insertSociety = async (society) => {
    try {
        if (society.presidentId && society.id && society.name) {

            let request = await axios.post('http://localhost:3000/api/society', {
                presidentId: society.presidentId,
                id: society.id,
                name: society.name
            });
            return request.data;
        } else {
            throw new Error(constants.responseMessages.sendProperFields)
        }
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

exports.insertElection = async (election) => {
    try {
        if (election.startTime && election.endTime && election.prepareTime && election.position && election.id && election.societies) {

            let request = await axios.post('http://localhost:3000/api/election', {
                startTime: election.startTime,
                endTime: election.endTime,
                prepareTime: election.prepareTime,
                position: election.position,
                id: election.id,
                societies: election.societies
            });
            return request.data;
        } else {
            throw new Error(constants.responseMessages.sendProperFields)
        }
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};