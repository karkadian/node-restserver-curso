const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/products');
const { existeProducto, existeNombreProducto, existeCategoria } = require('../helpers');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom( existeNombreProducto ),
    check('categoria', 'La categoria es obligatoria').notEmpty(),
    check('categoria', 'No es ID válido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    // check('categoria', 'No es ID válido').isMongoId(),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto)

module.exports = router;