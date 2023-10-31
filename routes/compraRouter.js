"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const compra = require('../controller/compra_controller.js');

// Ruta para realizar una compra
router.post('/compra', requiereToken, compra.compra);

// Ruta para obtener todas las compras
router.get('/getAllCompras', requiereToken, compra.getAll);

module.exports = router;