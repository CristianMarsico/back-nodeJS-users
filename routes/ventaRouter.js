"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DEL CONTROLADOR
const reporteVenta = require('../controller/reporteVenta')
const venta = require('../controller/venta_controller.js');

//HACEMOS USO DEL MIDDLEWARE
const { requiereToken } = require('../middlewares/requiereToken.js');
const { existsHilado } = require('../middlewares/existsHilado.js');

// Ruta para obtener todas las ventas
router.get('/getAllVentas', requiereToken, existsHilado, venta.getAll);

// Ruta para generar un reporte de ventas dentro de un rango de fechas
router.get('/reporteVenta/:fechaMin/:fechaMax', reporteVenta.reporteVenta);

// Ruta para realizar una venta
router.post('/venta', requiereToken, existsHilado, venta.venta);

module.exports = router;