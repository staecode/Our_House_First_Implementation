// at users resource routes

const e = require('express');
const express = require('express');
const router = express.Router(); // sub package express ships with that helps us arrive at different endpoints with different http words
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // password hashing
const jwt = require('jsonwebtoken'); // token creation
const checkAuth = require('../middleware/check-auth');


const User = require('../models/user');
const Room = require('../models/room');

//register different routes

router.get('/', (req, res, next) => { // parms: route, event handler
    User.find() // return all of them
    .select('name handle _id rooms')
    .populate('rooms')
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            users: docs.map( doc => {
                return {
                    name: doc.name,
                    handle: doc.handle,
                    _id: doc._id,
                    rooms: doc.rooms,
                    // where to look next to get more information about each
                    // individual document
                    request: {
                        type: 'GET',
                        description: 'link to user object',
                        url: 'http://localhost:3000/users/' + doc._id
                    }
                }
            })
        };
        res.status(200).json({response});      
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}); 

router.post('/signin', (req, res, next) => {
    User.find({handle: req.body.handle}) 
    .exec()
    .then(user => { // empty or one user 'array'
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Authentication Failed'
            });
        }
        // compare coming in plain text to stored
        // have to use bcrypt compare because it knows the algorithm
        // for hashing
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Authentication Failed'
                });
            } 
            if(result) {
                //build element of my json web token
                const token = jwt.sign(
                    {
                        handle: user[0].handle,
                        userId: user[0]._id
                    }, 
                    "" + process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Authentication Successful',
                    token: token
                });
            }
            // same error message occurs at all levels so as not to 
            // tell user attempting to log in more information than 
            // necessary about credentials, in case it is malicious
            // (password incorrect lets them know they have a 
            // successful username)
            return res.status(401).json({
                message: 'Authentication Failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/signup', (req, res, next) => { // route, event handler
    // first check handle availibility 
    User.find({handle: req.body.handle})
    .exec() // creates promise
    .then(user => {
        if(user.length >= 1) {
            // conflict 409 or unprocessable 422
            return res.status(409).json({
                message: 'User with handle is already in database'
            });
        } else {
            // now start adding
            // hash password with package
            // dictionary tables exist, database access may be able to get
            // access to simple passwords
            // so salting adds extra characters to strings, to break them up
            // and make them non recognizable 
            // (think discrete structures and encryption - the formulas that 
            // encode and decode can be recreated)
            // seconde parm is "salting rounds"
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    }); 
                } else {
                // get user information
                const user = new User({
                    // auto create unique id
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name, 
                    handle: req.body.handle,
                    password: hash,
                    rooms: []
                });
                // save object in database
                    user.save()
                    .then(result => {
                        console.log(result);
                            // 201, successful, resource created
                        res.status(201).json({ 
                        message: 'User ' + result.handle + ' was created!',
                        createdUser: {
                            name: result.name,
                            handle: result.handle,
                            _id: result.id,
                            password: result.password,
                            // provide response that allows domino to next execution
                            request: {
                                type: 'GET',
                                description: 'link to created user',
                                url: 'http://localhost:3000/users/' + result._id
                            }
                        }
                    });
                    })
                    .catch(err => {
                        res.status(500).json({error: err});
                    });            
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    })
});

router.get('/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    // need to fix, should not display all fields (docs, map etc)
    .then(doc => {
        // write data to response
        console.log(doc);
        if(doc) {
            res.status(200).json({doc});
        } else {
            res.status(404).json({message: 'No valid entry found for provided id'});
        }
    })
    .catch(err => {
        // couldn't get data, respond with error
        console.log(err);
        res.status(500).json({error: err});
    });
});

// change existing objects 
router.patch('/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    // build array of value pairs that need updating in database
    // must make body request iterable for this to work
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//et users list of rooms
router.get('/roomList/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(doc => {
        res.status(200).json({
            roomList: doc.rooms.map( room => {
                return {
                    _id: room,
                    request: {
                        type: 'GET',
                        description: 'link to room object',
                        url: 'http://localhost:3000/rooms/' + room
                    }
                }
            })
        });
    })
    .catch(err => {
        // couldn't get data, respond with error
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/addRoom/:userId/:roomId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    const r_id = req.params.roomId;

    Room.findById(r_id)
        .then(room => {
            User.findById(id)
            .exec()
            .then(doc => {
                if(doc) {
                    User.updateOne({_id: doc._id}, {$push: {rooms: r_id}})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Room added to user: " + doc._id,
                            requests: [
                                {
                                    type: 'GET',
                                    description: 'link to created room',
                                    url: 'http://localhost:3000/rooms/' + r_id
                                }
                            ]
                        })
                    })
                    .catch(err_add => {
                        console.log(err_add);
                    })
                }
            })
            .catch(err_user_find => {
                // couldn't get data, respond with error
                 res.status(500).json({error: err_user_find});
            })
        })
        .catch(err_room_find => {
            res.status(500).json({
                message: 'Room not found'
            });
        });
});


module.exports = router;