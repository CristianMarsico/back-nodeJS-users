"use strict";
const express = require('express');
const router = express.Router();
//HACEMOS USO DEL CONTROLADOR
const reporte = require('../controller/reporteController.js')
const reporteProduccion = require('../controller/reporteProduccion.js')
const mp = require('../controller/materia_prima_controller.js');

//HACEMOS USO DE LOS MIDDLEWARES
const { requiereToken } = require('../middlewares/requiereToken.js');
const { existsMateriaPrima } = require('../middlewares/existsMateriaPrima');

// Ruta para obtener materia prima por nombre
router.get('/getMPByName', requiereToken, mp.getMPByName);

// Ruta para obtener todas las materias primas
router.get('/getAllMP', requiereToken, mp.getAllMP);

// Ruta para generar un reporte de compras dentro de un rango de fechas
router.get('/reporteCompra/:fechaMin/:fechaMax', reporte.reporte)

// Ruta para generar un reporte de producción dentro de un rango de fechas
router.get('/reporteProduccion/:fechaMin/:fechaMax', reporteProduccion.reporteProduccion)

// Ruta para actualizar el stock de una materia prima por su ID
router.put('/actualizarStock_MP/:id/:stock', existsMateriaPrima, mp.updateStock);

// Ruta para actualizar el stock de un elemento de hilado por su ID
router.put('/updateStock/:id', requiereToken, mp.updateStock);

// Ruta para actualizar una materia prima por su ID
router.put('/updateMP/:id', requiereToken, mp.updateMP);

// Ruta para eliminar una materia prima por su ID
router.delete('/deleteMP/:id', requiereToken, mp.deleteMP);

module.exports = router;