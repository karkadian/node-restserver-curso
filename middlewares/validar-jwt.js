const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const { uid }= jwt.verify(token, process.env.JWTSECRETKEY);
        const usuario = await Usuario.findById(uid);

        //Verificar si el uid tiene estado true
        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        //Verificar si el uid tiene estado true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'token no válido'
        })
    }
}

module.exports = {
    validarJWT
}