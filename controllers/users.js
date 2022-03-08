const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usersGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [ total, items ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit( Number(limit) )
            .skip( Number(from) )
    ])

    res.json(
        { total, items }
    )
}

const usersPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD

    await usuario.save();

    res.json( usuario )
}

const usersPut = async (req = request, res) => {
    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json( usuario )
}

const usersDelete = async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true } );
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}