const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = express.response) => {
    const { email, password } = req.body;

    
    try{
        let user = await User.findOne({ email });
        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        
        user = new User( req.body );

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar token JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario'
        });
    }
}

const loginUser = async (req, res = express.response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Validar la contraseña
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword  ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar token JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al iniciar sesión'
        });
    }
}

const renewToken = async (req, res = express.response) => {
    const { uid, name } = req;

    // Generate new token JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token
    });
}

module.exports = {
    createUser, loginUser, renewToken
};