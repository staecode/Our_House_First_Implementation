// controller file for Room model
const mongoose = require('mongoose');
const Room = require('../models/room');

exports.rooms_get_all = (req, res, next) => { // route, event handler
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
};