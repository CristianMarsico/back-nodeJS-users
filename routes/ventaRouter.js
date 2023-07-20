"use strict";

const express = require('express');
const router = express.Router();

//HACEMOS USO DEL CONTROLADOR
const venta = require('../controller/venta_controller.js');

const { existsHilado } = require('../middlewares/existsHilado.js');

//ENDPOINTS
router.post('/venta', existsHilado, venta.venta);

module.exports = router;