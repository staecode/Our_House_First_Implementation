// at chats resource routes

const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words
const mongoose = require('mongoose');
// mongodb schemas
const Room = require('../models/room');
const User = require('../models/user');
// outside functions
const checkAuth = require('../middleware/check-auth');
const RoomsController = require('../controllers/rooms');
const room = require('../models/room');


//register different routes

router.get('/',  checkAuth, RoomsController.rooms_get_all);

router.post('/', checkAuth, (req, res, next) => { // route, event handler
    // get room information
    const id = req.userObj.userId;
    User.findById(id)
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            } else {
                const room = new Room ({
                    // auto create unique id
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    creator: user._id,
                    create_date: Date.now()
                });
                return room.save();
            }
    })
    .then(result => {
        User.findById(id)
            .exec()
            .then(doc => {
                if(doc) {
                    User.updateOne({_id: doc._id}, {$push: {rooms: result._id}})
                    .exec()
                    .then(added => {
                        res.status(201).json({
                            message: 'Room ' + result.name + ' was created!',
                            createdRoom: {
                                name: result.name,
                                creator: doc._id,
                                _id: result._id,
                                create_date: result.create_date,
                                requests: [
                                    {
                                        type: 'GET',
                                        description: 'link to created room',
                                        url: 'http://localhost:3000/rooms/' + result._id
                                        
                                    },
                                    {
                                        type: 'GET',
                                        description: 'Get user who created room',
                                        url: 'http://localhost:3000/users/' + doc._id
                                    }
                                ]
                            }
                        });
                    })
                    .catch(err_add => {
                        console.log(err_add);  
                    })
                }
            })
    })     
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/:roomId', checkAuth, (req, res, next) => {
    const id = req.params.roomId;
    Room.findById(id)
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json({doc});
        } else {
            res.status(404).json({message: 'No valid entry found for provided id'});
        }
    })
    .catch(err => {
        // couldn't get data, respond with error
        res.status(500).json({error: err});
    });
});

router.patch('/:roomId', checkAuth, (req, res, next) => {
    const id = req.params.roomId;
    const updateOps = {};
    // build array of value pairs that need updating in database
    // must make body request iterable for this to work
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Room.updateOne({_id: id}, {$set: updateOps})
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

router.delete('/:roomId', checkAuth, (req, res, next) => {
    const id = req.params.roomId;
    const user = req.userObj.userId;
    console.log(user);
    Room.findById(id)
    .exec()
    .then(room => {
        if(room) {
            if(room.creator != user) {
                    return res.status(401).json({
                        message: 'Delete not authorized'
                    });
                } 
                Room.remove({_id: id})
                .exec()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            res.status(404).json({message: 'No valid entry found for provided id'});
        }
        // if(room.length >= 1) {
        //     console.log(room[0]);
            //
        // }
    })
    .catch(err => {
        // couldn't get data, respond with error
        res.status(500).json({error: err});
    });
  });

module.exports = router;