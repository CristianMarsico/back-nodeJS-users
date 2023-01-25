"use strict";

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// //HACEMOS USO DEL CONTROLADOR
const authController = require('../controller/authController.js')
const { validatorReqExpress } = require('../middlewares/validatorRequest.js')
const { existsUserInBD } = require('../middlewares/existUserInDB.js');
const { requiereToken } = require('../middlewares/requiereToken.js');
const { requireRefreshToken } = require('../middlewares/requiereRefreshToken.js');


router.post('/register',
    [
        body("user", "faltan ingresar datos").trim().isLength({ min: 1 }),
        body("name", "faltan ingresar datos").trim().isLength({ min: 1 }),
        body("pass", "minimo 6 caracteres").trim().isLength({ min: 6 }),
        // body("pass", "Formato de pass incorrecto").custom(
        //     (value, { req }) => {
        //         if (value !== req.body.re_pass) {
        //             throw new Error("No coinciden las pass")
        //         }
        //         return value;
        //     }
        // ),
        // body("email", "Formato email incorrecto").trim().isEmail().normalizeEmail(),

    ],
    validatorReqExpress,
    existsUserInBD,
    authController.register)




router.post('/login',
    [
        body("user", "minimo 2 letras").trim().isLength({ min: 2 }),
        body("pass", "minimo 6 caracteres").trim().isLength({ min: 6 }),
    ],
    validatorReqExpress,
    authController.login)




router.get('/info', requiereToken, authController.info)

router.get('/refreshToken', requireRefreshToken, authController.refreshToken)


module.exports = router
