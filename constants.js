var exports = module.exports = {},
    voterModel = require('./models/Voter'),
    candidateModel = require('./models/Candidate');


exports.generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

exports.SALT = 10;
exports.secret = 'MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAW4lFUCuJ6QDo5djTQtuhebj9aNq/m59hwvgWNXNz3q8PJ6vQXEOoXE7smZARn+4+7RP+olUYfIGDiji4NBLYCQIDAQAB';

exports.isEmpty = (obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};


exports.isDuplicateVoter = async (user) => {
    let duplicateUser = await voterModel.find({studentId: user.studentId});
    return !Array.isArray(duplicateUser) || !duplicateUser.length;
};

exports.isDuplicateCandidate = async (user) => {
    let duplicateUser = await candidateModel.find({studentId: user.studentId});
    return !Array.isArray(duplicateUser) || !duplicateUser.length;
};


exports.responseMessages = {
    destroyedData :"I always wanted to do this! Destroy the world , destroying database is a start!",
    userNotFound : "User id doesn't exist",
    sendProperFields : "Please send proper fields",
    userIdExists : "User id already exist",
    passwordNotMatch: 'Password doesn\'t match - Please Retry',
    dataFetched: 'Success - Data fetched successfully',
    emailNotFound: 'Email not found - Please enter correct one',
    emailAlreadyExists: "Can't register - Email already exists",
    loggedOut: "User successfully logged out",
    Success: "Success",
    smsSuccess : "Successfully sent",
    notLoggedIn: "User not logged in"

};
