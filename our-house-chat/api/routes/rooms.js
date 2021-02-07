// at chats resource routes

const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words

//register different routes

router.get('/', (req, res, next) => { // route, event handler
    res.status(200).json({
        message: 'Handling GET request to /rooms'
    });
}); 

router.post('/', (req, res, next) => { // route, event handler
    const room = {
        roomName: req.body.roomName,
        creator: req.body.creator
    };
    res.status(201).json({ // 201, successful, resource created
        message: 'Handling POST request to /rooms',
        createdRoom: room
    });
}); 

router.get('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    res.status(200).json({
        message: 'Get room: ' + id
    }); 
});

router.put('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    res.status(200).json({
        message: 'Updated room: ' + id
    }); 
});

router.delete('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    res.status(200).json({
        message: 'Deleted room: ' + id
    }); 
});

module.exports = router;