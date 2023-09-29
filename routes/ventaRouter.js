"use strict";

const express = require('express');
const router = express.Router();

//HACEMOS USO DEL CONTROLADOR
const reporteVenta = require('../controller/reporteVenta')
const venta = require('../controller/venta_controller.js');

//HACEMOS USO DEL MIDDLEWARE
const { requiereToken } = require('../middlewares/requiereToken.js');
const { existsHilado } = require('../middlewares/existsHilado.js');

//ENDPOINTS
router.get('/getAllVentas', requiereToken, existsHilado, venta.getAll);
router.get('/reporteVenta/:fechaMin/:fechaMax', reporteVenta.reporteVenta);

router.post('/venta', requiereToken, existsHilado, venta.venta);

module.exports = router;