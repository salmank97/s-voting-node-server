let express = require("express"),
    methodOverride = require("method-override"),
    app = express(),
    cors = require('cors'),
    OneSignal = require('onesignal-node'),
    expressBrute = require('express-brute'),
    constants = require('./constants'),
    bodyParser = require("body-parser"),
    db_read = require("./db_functions/read"),
    db_insert = require("./db_functions/insert"),
    db_delete = require("./db_functions/delete"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://taha:qweasd123@ds231374.mlab.com:31374/s-voting-database");
app.use(bodyParser.json({extended: true}));
app.use(cors());
app.use(methodOverride("_method"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// create a new Client for a single app
var myClient = new OneSignal.Client({
    userAuthKey: 'YWNiOGJkNjctNDQwYS00N2YzLThlOWEtZmVmZTYxMTU2ZmE5',
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: 'ZGVlODhkNWQtMWU4ZS00NTFhLWEwNmQtOGIwZDI2NmEwOTRh', appId: '75f4fbb3-59e2-48a6-bacf-06ad7692d3ae' }
});

var store = new expressBrute.MemoryStore(); // stores state locally
var bruteforce = new expressBrute(store);

////////////////////////---------------------------------------------  USER ROUTES -----------------------------------------------/////////////////////////


app.post('/castVote', function (req, res) {
    db_insert.castVote(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response
                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});


app.post('/destroy', function (req, res) {
    db_delete.destroy().then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.destroyedData,
                data: {
                    result: response
                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});



app.post('/signIn', function (req, res) {
    db_read.authenticateUser(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response
                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/signUp', function (req, res) {
    db_insert.insertUser(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});





app.post('/getVoters', function (req, res) {
    db_read.getAllVoters().then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});


app.post('/getCandidates', function (req, res) {
    db_read.getAllCandidates().then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});


app.post('/addEligibleCandidates', function (req, res) {
    db_insert.insertEligibleStudents(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/addNotification', function (req, res) {
    db_insert.addNotification(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});


app.post('/getNotification', function (req, res) {
    db_read.getNotification(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/getSociety', function (req, res) {
    db_read.getSocieties().then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/addSociety', function (req, res) {
    db_insert.insertSociety(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/getElectionStatus', function (req, res) {
    db_read.getElections().then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/', function (req, res) {
    db_insert.insertElection(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});

app.post('/addElection', function (req, res) {
    db_insert.insertElection(req.body).then((response) => {
        //SUCCESS
        res.status(201).send(
            {
                responseCode: 201,
                responseMessage: constants.responseMessages.Success,
                data: {
                    result: response

                }
            }
        )
    }).catch((error) => {
        //ERROR
        res.status(500).send(
            {
                responseCode: 500,
                responseMessage: error.message
            }
        )
    });
});


const port = process.env.PORT || 8000;
app.listen(port);

console.log(`S-Voting-Server listening on ${port}`);

module.exports.app = app;