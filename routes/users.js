const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers');

const { 
    validarCampos,
    validarJWT,
    tieneRole
 } = require('../middlewares');

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usersPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usersPut);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usersDelete);

module.exports = router;