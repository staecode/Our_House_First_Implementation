// at chats resource routes

const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words
const mongoose = require('mongoose');
const Room = require('../models/room');
const User = require('../models/user');

//register different routes

router.get('/', (req, res, next) => { // route, event handler
    Room.find() //return all of them
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json({docs});
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
    const created_by = req.body.creator;
    const room = new Room ({
        // auto create unique id
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        creator: created_by
    });
    // save object in database
    // post result to console
    room.save()
    .then(result => {
        console.log(result);
            // 201, successful, resource created
        res.status(201).json({ 
        message: 'Room ' + room.name + ' was created!',
        createdRoom: room
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
    User.updateOne({_id: created_by}, {$push: {rooms: room}})
    .exec()
    .then(added => {
        console.log(added);
    })
    .catch(err2 => {
        console.log(err2);
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

router.put('/:roomId', (req, res, next) => {
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
    User.updateMany({'$pull': {"rooms": {"_id": id}}})
    .exec()
    .then(removed => {
        console.log(removed);
    })
    .catch(err2 => {
        console.log(removed);
    });
});

module.exports = router;