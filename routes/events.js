/*
    Rutas de usuarios / events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, removeEvent } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const router = Router();

router.use( jwtValidator );

router.get('/', getEvents)

router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria.').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria.').custom( isDate ),
        fieldValidator
    ],
    
    createEvent)

    router.put('/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria.').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria.').custom( isDate ),
        fieldValidator
    ], updateEvent)

router.delete('/:id', removeEvent)

module.exports = router;
