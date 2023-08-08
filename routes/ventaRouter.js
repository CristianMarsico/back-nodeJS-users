"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const venta = require('../controller/venta_controller.js');

const { existsHilado } = require('../middlewares/existsHilado.js');

//ENDPOINTS
router.post('/venta', requiereToken, existsHilado, venta.venta);

module.exports = router;