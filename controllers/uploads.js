const path = require('path');
const fs = require('fs');

const  cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const { response } = require('express');

const cargarArchivo = async(req, res = response) => {
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })
    } catch (err) {
        res.status(400).json({ msg: err });
    }

}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Coleccion no definida' });
    }

    if( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }
    
    try {
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;

        await modelo.save();
        res.json(modelo);
    } catch (err) {
        res.status(400).json({ msg: err });
    }
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Coleccion no definida' });
    }

    if( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }
    
    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;

        await modelo.save();
        res.json(modelo);
    } catch (err) {
        res.status(400).json({ msg: err });
    }
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Coleccion no definida' });
    }

    if( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen )
        }
    }
    
    const pathPlaceholder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathPlaceholder);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}