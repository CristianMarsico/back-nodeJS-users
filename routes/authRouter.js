"use strict";

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

//HACEMOS USO DEL CONTROLADOR
const authController = require('../controller/authController.js')
const reporte = require('../controller/reporteController.js')

//HACEMOS USO DE LOS MIDDLEWARES
const { validatorReqExpress } = require('../middlewares/validatorRequest.js')
const { existsUserInBD } = require('../middlewares/existUserInDB.js');
const { requiereToken } = require('../middlewares/requiereToken.js');
const { requireRefreshToken } = require('../middlewares/requiereRefreshToken.js');

//ENDPOINTS
router.post('/register',
    [
        body("nombre", "faltan ingresar datos").trim().isLength({ min: 1 }),
        body("usuario", "faltan ingresar datos").trim().isLength({ min: 1 }),
        body("pass", "minimo 6 caracteres").trim().isLength({ min: 6 }),
        // body("rol", "minimo 4 caracteres").trim().isLength({ min: 4 }),
        body("pass", "Formato de pass incorrecto").custom(
            (value, { req }) => {
                if (value !== req.body.confirm_pass) {
                    throw new Error("No coinciden las contraseñas")
                }
                return value;
            }
        ),
        body("email", "Formato email incorrecto").trim().isEmail().normalizeEmail(),

    ],
    validatorReqExpress,
    existsUserInBD,
    authController.register);


router.post('/login',
    [
        body("usuario", "minimo 4 letras").trim().isLength({ min: 4 }),
        body("usuario", "maximo 20 letras").trim().isLength({ max: 20 }),
        body("pass", "minimo 6 caracteres").trim().isLength({ min: 6 }),
        body("pass", "maximo 20 caracteres").trim().isLength({ max: 20 }),
    ],
    validatorReqExpress,
    authController.login)



router.delete('/deleteUser/:id', requiereToken, existsUserInBD, authController.deleteUser)


router.get('/info', requiereToken, authController.info)

router.get('/getAll', authController.getAllUser)

router.get('/refreshToken', requireRefreshToken, authController.refreshToken)

router.get('/logout', authController.logout)

router.get('/reporteCompra/:fecha', reporte.reporte)


module.exports = router
