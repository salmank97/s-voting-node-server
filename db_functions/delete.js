var exports = module.exports = {},
    constants = require ('../constants'),
    voterModel = require('../models/Voter'),
    candidateModel = require('../models/Candidate'),
     db_delete = require("../db_functions/delete");


exports.destroy = async () =>{
    try {

       await voterModel.remove({});
       await candidateModel.remove({});

        return constants.responseMessages.Success;



    } catch (e) {

    }
};

exports.deleteHangoutPlace = async (placeId) => {
    try {
        let hangoutPlace = await  hangoutModel.findByIdAndRemove(placeId);
        return hangoutPlace.name
    }  catch (e) {
        console.log(e);
        throw new Error(e)
    }
};


exports.deleteFeaturedPlaceUserReview= async (reviewId) => {
    try {
        await  userReviewModel.findByIdAndRemove(reviewId);
        return constants.responseMessages.Success
    }  catch (e) {
        console.log(e);
        throw new Error(e)
    }
};


exports.deleteFeaturedPlace = async (placeId) => {
    try {
       let featuredShortData = await  foodFeaturedModel.findByIdAndRemove(placeId);
        await  foodFeaturedDetailModel.findByIdAndRemove(featuredShortData.featured_detail_id);
        return featuredShortData.name
    }  catch (e) {
        console.log(e);
        throw new Error(e)
    }
};
