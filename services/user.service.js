var config = require('config.json')[process.env.NODE_ENV || 'dev'];
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

var Q = require('q');


var serviceUser = {};

const User = require('../models/user.js');
const Cliente = require('../models/cliente.js');

serviceUser.authenticate = authenticate;
serviceUser.changeUserEmail = changeUserEmail;
serviceUser.changeUserPwd = changeUserPwd;
serviceUser.getUsersByManager = getUsersByManager;
serviceUser.insOrUpdUser = insOrUpdUser;


module.exports = serviceUser;

//SECURITY SECTION - START
function authenticate(username, password) {
    console.log("richiesto username " + username)
    var deferred = Q.defer();
    var userSelected = {};
    User.findOne({ "username": { $eq: username } })
        .populate("clienti.cliente")
        .exec((err, user) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                console.log(config.secret);
                if (user && bcrypt.compareSync(password, user.password)) {
                    //aggiungo il token
                    userSelected = JSON.parse(JSON.stringify(user));
                    userSelected.token = jwt.sign({ sub: userSelected._id }, config.secret);
                    console.log(userSelected);
                    deferred.resolve(userSelected)
                } else {
                    deferred.resolve();
                }
            }
        });

    return deferred.promise;
}

function addUser(userParam) {
    console.log("addUser " + userParam._id)
    var deferred = Q.defer();
    // set user object to userParam without the cleartext password
    var user = _.omit(userParam, 'password');
    console.log(user);
    // add hashed password to user object
    user.password = bcrypt.hashSync(userParam.password, 10);

    let newUser = new User(user);
    console.log(newUser);
    var query = { '_id': newUser._id };
    User.findOneAndUpdate(query, newUser, { upsert: true }, function (err, doc) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve({ msg: 'User add successfully' });
        }
    });
    return deferred.promise;
}


function getUsersByManager(userLogged) {
    var logPrefix = 'user.service.getUsersByManager: ';
    var deferred = Q.defer();
    let utente = new User();
    var userManager = [];
    console.log('userLogged ' + userLogged);

    var query = [
        {
            $project:
            {
                isAdmin: "$isAdmin",
                clienti: {
                    $filter: {
                        input: '$clienti',
                        as: 'item',
                        cond: { $eq: ['$$item.profilo', 'AP'] }
                    }
                }
            }
        },
        {
            $match: {
                "_id": mongoose.Types.ObjectId(userLogged)
            }
        },
        {
            $unwind: {
                path: '$clienti',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                isAdmin: '$isAdmin',
                cliente: '$clienti.cliente',
            }
        },
        {
            $group: {
                _id: "$_id",
                isAdmin: {
                    $last: '$isAdmin',
                },
                clienti: {
                    $push:
                    '$cliente'
                }
            }
        }
    ];

    User.aggregate(query).exec((err, userManager) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        else {
            console.log("userManager, err: " + userManager + "----" + err);
            if (userManager[0] != null) {
                console.log("userManager[0].isAdmin: " + userManager[0].isAdmin);

                if (userManager[0].isAdmin == true) {
                    User.find()
                        .populate("clienti.cliente")
                        .exec(function (err, users) {
                            if (err) {
                                deferred.reject(err.name + ': ' + err.message);
                            } else {
                                console.log("service" + users);
                                deferred.resolve(users);
                            }
                        });
                }
                else {
                    User.find({ "clienti": { "$elemMatch": { "cliente": { "$in": userManager[0].clienti } } } })
                        .populate("clienti.cliente")
                        .exec(
                        function (err, users) {
                            if (err)
                                deferred.reject(err.name + ': ' + err.message);
                            else
                                deferred.resolve(users);
                        });
                }
            } else {
                console.log('User not retrieved!');
            }
        }
    });
    return deferred.promise;
}

function changeUserEmail(username, newEmail) {
    var logPrefix = 'user.service.changeUserEmail: ';

    console.log(logPrefix + "richiesto cambio email username " + username + ", newEmail:" + newEmail);

    var deferred = Q.defer();
    User.findById(username, (err, user) => {
        if (err) {
            console.log(logPrefix + "error findById");
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if (user) {
                console.log(logPrefix + "user found");
                user.email = newEmail;
                user.save(function (err) {
                    if (err) {
                        console.log(logPrefix + "user update email fail");
                        deferred.reject(err.name + ': ' + err.message);
                    } else {
                        console.log(logPrefix + "user update email ok");
                        deferred.resolve({ msg: 'User email changed successfully' });
                    }
                });
            } else {
                console.log(logPrefix + "user not found");
                deferred.reject("user not found");
            }
        }
    });

    return deferred.promise;
}
function changeUserPwd(userLogged, oldPwd, newPwd) {

    var logPrefix = 'user.service.changeUserPwd: ';
    console.log(logPrefix + "richiesto cambio pwd username " + userLogged._id);

    var deferred = Q.defer();
    User.findById(userLogged._id, (err, user) => {
        if (err) {
            console.log(logPrefix + "error findById");
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if (user) {
                if (bcrypt.compareSync(oldPwd, user.password)) {
                    user.password = bcrypt.hashSync(newPwd, 10);
                    user.save(function (err) {
                        if (err) {
                            console.log(logPrefix + "user update pwd fail");
                            deferred.reject(err.name + ': ' + err.message);
                        } else {
                            console.log(logPrefix + "user update pwd ok");
                            deferred.resolve({ msg: 'User password changed successfully' });
                        }
                    });
                } else {
                    console.log(logPrefix + "oldPwd not correct");
                    deferred.reject("oldPwd not correct");
                }
            } else {
                console.log(logPrefix + "user not found");
                deferred.reject("user not found");
            }
        }
    });

    return deferred.promise;
}
//SECURITY SECTION - END

//CRUD - CREATE UPDATE
function insOrUpdUser(userParam) {
    console.log("addUser " + userParam._id)
    var deferred = Q.defer();

    let newUser = new User(userParam);

    var query = { '_id': newUser._id };
    if (newUser.password != null && !newUser.password.startsWith('$2a'))
        newUser.password = bcrypt.hashSync(userParam.password, 10);

    getUserById(newUser._id).then(user => {
        //INSERT
        if (user == null) {
            countUsersByUsername(newUser.username).then(count => {
                if (count == 0)
                    findOneAndUpdate(query, newUser).then(user => deferred.resolve(user));
                else
                    deferred.reject("Username non disponibile");
            });
        }
        //UPDATE
        else {
            countUsersByUsername(newUser.username).then(count => {
                if (count == 1) {
                    getUserByUsername(newUser.username).then(userInEdit => {
                        //CONFRONTO ID in input con ID oggetto già esistente in DB
                        if (userInEdit._id.equals(newUser._id))
                            findOneAndUpdate({ _id: newUser.id }, newUser).then(res => deferred.resolve(res));
                        else
                            deferred.reject("Username non disponibile");
                    })
                }
                else if(count == 0)
                    findOneAndUpdate({ _id: newUser.id }, newUser).then(res => deferred.resolve(res));
                else
                    deferred.reject("Presenti duplicati");
            });
        }
    })

    return deferred.promise;
}

function findOneAndUpdate(query, newUser) {
    var deferred = Q.defer();
    User.findOneAndUpdate(query, newUser, { new: true, upsert: true })
        .populate({
            path: "clienti.cliente",
            model: Cliente
        })
        .exec((err, user) => {
            if (err)
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(user);
        });
    return deferred.promise;
}

function countUsersByUsername(username) {
    var deferred = Q.defer();

    User.find({ "username": username }).count(function (err, doc) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function getUserById(id) {
    var deferred = Q.defer();

    User.findById({ "_id": id }, function (err, cliente) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else
            deferred.resolve(cliente);
    });

    return deferred.promise;
}

function getUserByUsername(username) {
    var deferred = Q.defer();

    User.findOne({ "username": username }, function (err, doc) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);
        else
            deferred.resolve(doc);
    });

    return deferred.promise;
}
