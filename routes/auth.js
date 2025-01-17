/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [ // middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo electrónico es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    createUser
);

router.post(
    '/', 
    [
        check('email', 'El correo electrónico es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),  // La contraseña no puede estar vacía, ya que es la que se usará para generar el token de autenticación
        validarCampos
    ],
    loginUser
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;