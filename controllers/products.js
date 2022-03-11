const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
    const { limit = 5, from =  0 } = req.query;
    const query = { estado: true };

    const [ total, items ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .limit( Number(limit) )
            .skip( Number(from) )
    ])

    res.json({ total, items });
}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto
                            .findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    res.json({ producto });
}

const crearProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }
    
        const producto = new Producto( data );
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al intentar crear la Producto'
        })
    }
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre     = data.nombre.toUpperCase()
    }
    
    data.usuario    = req.usuario._id;

    const producto = await Producto
                            .findByIdAndUpdate( id, data, { new: true })
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    res.json({ producto });
}

const borrarProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto
                            .findByIdAndUpdate(id, { estado: false }, { new: true })
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    res.json({ producto });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}