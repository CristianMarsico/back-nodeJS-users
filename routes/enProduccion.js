"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const enProduc = require('../controller/enProduccion_controller.js');

// Ruta para obtener todos los elementos en producción
router.get('/getAllEnProduc', requiereToken, enProduc.getAll);

module.exports = router;