const { request, response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {
    const { limit = 5, from =  0 } = req.query;
    const query = { estado: true };

    const [ total, items ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .limit( Number(limit) )
            .skip( Number(from) )
    ])

    res.json({ total, items });
}

const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria
                            .findById(id)
                            .populate('usuario', 'nombre')
    res.json({ categoria });
}

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    try {
        const data = {
            nombre,
            usuario: req.usuario._id
        }
    
        const categoria = new Categoria( data );
        await categoria.save();
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al intentar crear la categoria'
        })
    }
}

const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    data.nombre     = data.nombre.toUpperCase()
    data.usuario    = req.usuario._id;

    const categoria = await Categoria
                            .findByIdAndUpdate( id, data, { new: true })
                            .populate('usuario', 'nombre')
    res.json({ categoria });
}

const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria
                            .findByIdAndUpdate(id, { estado: false }, { new: true })
                            .populate('usuario', 'nombre')
    res.json({ categoria });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}