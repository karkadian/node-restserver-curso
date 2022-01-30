const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey} = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    })
}

const usersPost = (req, res) => {

    const body = req.body;

    res.json({
        msg: 'post API - Controlador',
        body
    })
}

const usersPut = (req, res) => {
    const id = req.params.id;

    res.json({
        msg: 'put API - Controlador',
        id
    })
}

const usersDelete = (req, res) => {
    res.json({
        msg: 'delete API - Controlador'
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}