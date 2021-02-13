// at chats resource routes

const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words
const mongoose = require('mongoose');
const room = require('../models/room');

const Room = require('../models/room');
const User = require('../models/user');

//register different routes

router.get('/', (req, res, next) => { // route, event handler
    Room.find() //return all of them
    .select('name creator _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            //create new array
            rooms: docs.map( doc => {
                return {
                    name: doc.name,
                    creator: doc.creator,
                    _id: doc._id,
                    // where to look next to get more information about each
                    // individual document
                    request: {
                        type: 'GET',
                        description: 'link to room object',
                        url: 'http://localhost:3000/rooms/' + doc._id
                    }
                }
            })
        };
        // console.log(docs);
        res.status(200).json({response});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => { // route, event handler
    // get room information
    const id = req.body.creator;
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

router.get('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    Room.findById(id)
    .exec()
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

router.patch('/:roomId', (req, res, next) => {
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

router.delete('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    Room.remove({_id: id})
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

module.exports = router;