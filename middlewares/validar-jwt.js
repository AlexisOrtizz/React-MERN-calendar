const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.headers['x-token'];

    if (!token) {
        return res.status(401).json({
            ok: false, 
            msg: 'No hay token en la petición' 
        });
    }

    try{
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        
        req.uid = uid;
        req.name = name;

    } catch(error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    };

    next();
};

module.exports = { validarJWT };