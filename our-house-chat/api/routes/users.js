// at users resource routes

const express = require('express');
const router = express.Router(); //sub package express ships with that helps us arrive at different endpoints with different http words

//register different routes

router.get('/', (req, res, next) => { // route, event handler
    res.status(200).json({
        message: 'Handling GET request/users'
    });
}); 

router.post('/', (req, res, next) => { // route, event handler
    res.status(201).json({ // 201, successful, resource created
        message: 'Handling POST request/users'
    });
}); 

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'Get user: ' + id
    }); 
});

router.put('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'Updated user: ' + id
    }); 
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'Deleted user: ' + id
    }); 
});

module.exports = router;