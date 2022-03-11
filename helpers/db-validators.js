const {
    Role,
    Usuario,
    Categoria,
    Producto
} = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if( existeEmail ) {
        throw new Error(`El correo ${correo} ya existe en la BD`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ) {
        throw new Error(`El usuario con id ${id} no existe`);
    }
}

const existeCategoria = async(id) => {
    const existeCategoria = Categoria.findById(id);
    if( !existeCategoria ) {
        if( !existeCategoria ) {
            throw new Error(`La categoria con id ${id} no existe`);
        }
    }
}

const existeNombreCategoria = async(nombre) => {
    const nombreUppercased = nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre: nombreUppercased });

    if( categoriaDB ) {
        throw new Error(`La categoria ${ categoriaDB.nombre }, ya existe`);
    }
}

const existeProducto = async(id) => {
    const existeProducto = Producto.findById(id);
    if( !existeProducto ) {
        if( !existeProducto ) {
            throw new Error(`La categoria con id ${id} no existe`);
        }
    }
}

const existeNombreProducto = async(nombre) => {
    const nombreUppercased = nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre: nombreUppercased });

    if( productoDB ) {
        throw new Error(`La categoria ${ productoDB.nombre }, ya existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeNombreCategoria,
    existeProducto,
    existeNombreProducto
}