const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categories');
const { existeCategoria, existeNombreCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerCategorias)

router.get('/:id', [
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom( existeNombreCategoria ),
    validarCampos
], crearCategoria)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre').custom( existeNombreCategoria ),
    validarCampos
], actualizarCategoria)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria)

module.exports = router;