"use strict";
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

//HACEMOS USO DEL CONTROLADOR
const authController = require('../controller/authController.js')

//HACEMOS USO DE LOS MIDDLEWARES
const { validatorReqExpress } = require('../middlewares/validatorRequest.js')
const { existsUserInBD } = require('../middlewares/existUserInDB.js');
const { requireRefreshToken } = require('../middlewares/requiereRefreshToken.js');

// Ruta para registrar un nuevo usuario
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

// Ruta para iniciar sesión de usuario
router.post('/login',
    [
        body("usuario", "minimo 4 letras").trim().isLength({ min: 4 }),
        body("usuario", "maximo 20 letras").trim().isLength({ max: 20 }),
        body("pass", "minimo 6 caracteres").trim().isLength({ min: 6 }),
        body("pass", "maximo 20 caracteres").trim().isLength({ max: 20 }),
    ],
    validatorReqExpress,
    authController.login)


// Ruta para eliminar un usuario por su ID
router.delete('/deleteUser/:id', existsUserInBD, authController.deleteUser)

// Ruta para actualizar los datos de un usuario por su ID
router.put('/updateUser/:id', authController.updateUser)

// Ruta para obtener todos los usuarios
router.get('/getAll', authController.getAllUser)

// Ruta para obtener un usuario por su ID
router.get('/getUserById/:id', authController.getUserByID)

// Ruta para renovar el token de autenticación
router.get('/refreshToken', requireRefreshToken, authController.refreshToken)

// Ruta para cerrar sesión de usuario
router.get('/logout', authController.logout)



module.exports = router
