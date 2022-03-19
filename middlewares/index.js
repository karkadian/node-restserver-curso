const  validarArchivo  = require('./validar-archivo');
const  validarCampos        = require('./validar-campos');
const  validarJWT           = require('./validar-jwt');
const  validarRoles         = require('./validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}