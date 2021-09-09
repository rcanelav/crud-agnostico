/*
    Rutas de usuarios / auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, userLogin, validateToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const router = Router();

router.post(
    '/new',
    [
        check("name", 'El nombre es obligatorio').not().isEmpty(),
        check("email", 'El email es obligatorio').isEmail(),
        check("password", 'El password es debe ser de 6 carácteres').isLength({ min: 6 }),
        fieldValidator
    ],
    createUser );

router.post('/',
    [
        check("email", 'El email es obligatorio').isEmail(),
        check("password", 'El password es debe ser de 6 carácteres').isLength({ min: 6 }),
        fieldValidator
    ], userLogin );

router.get('/renew', jwtValidator, validateToken );

module.exports = router;