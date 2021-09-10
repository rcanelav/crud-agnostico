const { response } = require('express');
const EventModel = require('../models/EventModel');
const UserModel = require('../models/UserModel');


const getEvents = async( req, res = response ) => {
        const events = await EventModel.find().populate('user', 'name', UserModel)
    
    res.status(200).json({
        ok: true,
        events
    })
}

const createEvent = async( req, res = response ) => {
    const event = new EventModel( req.body );

    try {
        event.user = req.uid;
        const eventDB = await event.save();
        res.json({
            ok: true,
            event: eventDB
        })
    } catch ( error ) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador.'
        })
    }
}

const updateEvent = async ( req, res = response ) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event = await EventModel.findById( eventId );

        if( !event ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            });
        }
        if( event.user.toString() !== uid ){
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento.'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }
        
        const updatedEvent = await EventModel.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            event: updatedEvent
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        })
    }
}

const removeEvent = async( req, res = response ) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event = await EventModel.findById( eventId );

        if( !event ) {
            return  res.status( 404 ).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            });
        }
        if( event.user.toString() !== uid ){
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento.'
            })
        }

        
        await EventModel.findByIdAndDelete( eventId );

        res.json({ ok: true });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    removeEvent
}