var exports = module.exports = {},
    candidateModel = require("../models/Candidate"),
    ElectionModel = require('../models/Election'),
    constants = require('../constants'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    axios = require('axios'),
    notificationModel = require('../models/Notification'),
    voterModel = require('../models/Voter');

// HYPERLEDGER FUNCTIONS


exports.getNotification = async () => {
    try {
       return await notificationModel.find({});
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};


exports.getSocieties = async () => {
    try {
       let request =  await axios.get('http://localhost:3000/api/society');
       return request.data;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};


exports.getElections = async () => {
    try {
        let totalVotes = 0 ;
        let candidates = [] ;

        let candidateRawRequest =  await axios.get('http://localhost:3000/api/candidate');
        let candidateRequest = candidateRawRequest.data;

        for(let i = 0 ; i < candidateRequest.length ; i++){
           candidates.push({
               name : candidateRequest[i].name,
               id : candidateRequest[i].id,
               votes : candidateRequest[i].totalVotes
           })
        }

        let voteRawRequest =  await axios.get('http://localhost:3000/api/Vote');
        let voteRequest = voteRawRequest.data;


        for ( let j = 0 ; j <voteRequest.length ; j++ ){

            if(voteRequest[j].owner.includes("Candidate")){
                totalVotes++;
                let candidateId = voteRequest[j].owner.split('#');
                for (let i = 0 ; i < candidates.length ; i++){
                    if(candidates[i].id === candidateId[1]){
                        candidates[i].votes++;
                    }
                }
            }


        }

        let request =  await axios.get('http://localhost:3000/api/election');


        return {data: request.data[0] , totalVotes : totalVotes , candidates : candidates};

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

exports.getAllCandidates = async () => {
    try {
        let request =  await axios.get('http://localhost:3000/api/candidate');
        return request.data;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

exports.getElectionStatus = async () => {
    try {
        return await ElectionModel.find({});
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};


exports.getAllVoters = async () => {
    try {
        let request =  await axios.get('http://localhost:3000/api/voter');
        return request.data;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};


// USER-LOGIN FUNCTIONS

exports.authenticateUser =async (user) => {
        if(user.isVoter === true){
            return await exports.authenticateVoter(user);
        } else if (user.isCandidate === true){
            return await exports.authenticateCandidate(user)
        }
};

exports.authenticateVoter = async (user) => {
    try {
        let dbUser = await voterModel.find({studentId: user.studentId});
        if (constants.isEmpty(dbUser)) {
            throw new Error(constants.responseMessages.userNotFound)
        }
        let match = await bcrypt.compare(user.password, dbUser[0].password);
        if (!match) {
            throw new Error(constants.responseMessages.passwordNotMatch);
        }

        let token = jwt.sign({id: dbUser[0]._id}, constants.secret, {
            expiresIn: 84600
        });

        let returningUser = dbUser[0].toObject();
        delete returningUser.password;

        return {auth: true, token: token, user: returningUser}

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

exports.authenticateCandidate = async (user) => {
    try {
        let dbUser = await candidateModel.find({studentId: user.studentId});
        if (constants.isEmpty(dbUser)) {
            throw new Error(constants.responseMessages.userNotFound)
        }
        let match = await bcrypt.compare(user.password, dbUser[0].password);
        if (!match) {
            throw new Error(constants.responseMessages.passwordNotMatch);
        }

        let token = jwt.sign({id: dbUser[0]._id}, constants.secret, {
            expiresIn: 84600
        });

        let returningUser = dbUser[0].toObject();
        delete returningUser.password;

        return {auth: true, token: token, user: returningUser}

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};
