const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares');

const router = Router();

router.post('/login' , [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
],login);

router.post('/google' , [
    check('id_token', 'id_token de google es obligatorio').notEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;