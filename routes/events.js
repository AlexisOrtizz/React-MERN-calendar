/*
    Rutas de Eventos / Events
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Aplica el middlewares a todas la rutas por debajo del route.use(fn);
router.use( validarJWT );

router.get('/', getEvents);

router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'La fecha de fin es obligatoria').custom( isDate ),
    validarCampos
], createEvent);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;