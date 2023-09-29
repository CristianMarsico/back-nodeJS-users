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

//ENDPOINTS
router.get('/getMPByName', requiereToken, mp.getMPByName);
router.get('/getAllMP', requiereToken, mp.getAllMP);
router.get('/reporteCompra/:fechaMin/:fechaMax', reporte.reporte)
router.get('/reporteProduccion/:fechaMin/:fechaMax', reporteProduccion.reporteProduccion)

router.put('/actualizarStock_MP/:id/:stock', existsMateriaPrima, mp.updateStock);
router.put('/updateStock/:id', requiereToken, mp.updateStock);
router.put('/updateMP/:id', requiereToken, mp.updateMP);

router.delete('/deleteMP/:id', requiereToken, mp.deleteMP);

module.exports = router;