const { response, request } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
    try {
        const events = await Event.find()
                                .populate('user', 'name');
        res.status(200).json({
            ok: true,
            events
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los eventos'
        });
    }
};

const createEvent = async (req, res = response) => {
    const event = new Event( req.body );

    try {
        event.user = req.uid;

        const savedEvent = await event.save();

        res.status(201).json({
            ok: true,
            evento: savedEvent
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento'
        });
    }
};

const updateEvent = async (req, res = response) => {
    const eventId = req.params.id;
    try {
        const event = await Event.findById( eventId );
        const uid = req.uid;

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para actualizar este evento'
            });
        }

        const newEvent = { ...req.body, user: uid };

        const updateEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(200).json({
            ok: true,
            event: updateEvent
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el evento'
        });
    }
};

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findById( eventId );
        const uid = req.uid;

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para actualizar este evento'
            });
        }

        await Event.findByIdAndDelete( eventId );

        res.status(200).json({ ok: true });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar el evento'
        });
    }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };