// at users resource routes

const e = require('express');
const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words
const mongoose = require('mongoose');
const User = require('../models/user');

//register different routes

router.get('/', (req, res, next) => { // route, event handler
    User.find() // return all of them
    .select('name handle _id rooms')
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

router.post('/', (req, res, next) => { // route, event handler
    // get user information
    const user = new User({
        // auto create unique id
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name, 
        handle: req.body.handle,
        rooms: []
    });
    // save object in database
    // post result to console
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
                request: {
                    type: 'GET',
                    description: 'link to created user',
                    url: 'http://localhost:3000/users/' + result._id
                }
            }
        });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
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

// change existing objects 
router.patch('/:userId', (req, res, next) => {
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

router.delete('/:userId', (req, res, next) => {
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
router.get('/roomList/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(doc => {
        res.status(200).json({
            roomList: doc.rooms
        });
        // write data to response
        // console.log(doc);
        // if(doc) {
        //     res.status(200).json({doc});
        // } else {
        //     res.status(404).json({message: 'No valid entry found for provided id'});
        // }
    })
    .catch(err => {
        // couldn't get data, respond with error
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/addRoom/:userId/:roomId', (req, res, next) => {
    const id = req.params.userId;
    const r_id = req.params.roomId;
    User.findById(id)
    .exec()
    .then(doc => {
        if(doc) {
            User.updateOne({_id: id}, {$push: {rooms: r_id}})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Room added to user: " + id
                })
            })
            .catch(err2 => {
                console.log(err2);
            })
        }
        // res.status(200).json({
        //     roomList: doc.rooms
        // });
        // write data to response
        // console.log(doc);
        // if(doc) {
        //     res.status(200).json({doc});
        // } else {
        //     res.status(404).json({message: 'No valid entry found for provided id'});
        // }
    })
    .catch(err => {
        // couldn't get data, respond with error
        console.log(err);
        res.status(500).json({error: err});
    });
});


module.exports = router;