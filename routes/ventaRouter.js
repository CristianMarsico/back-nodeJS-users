"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');
const reporteVenta = require('../controller/reporteVenta')

//HACEMOS USO DEL CONTROLADOR
const venta = require('../controller/venta_controller.js');

const { existsHilado } = require('../middlewares/existsHilado.js');

//ENDPOINTS
router.post('/venta', requiereToken, existsHilado, venta.venta);
router.get('/reporteVenta/:fechaMin/:fechaMax', reporteVenta.reporteVenta);

module.exports = router;