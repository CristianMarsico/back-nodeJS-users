"use strict";

const express = require('express');
const router = express.Router();

//HACEMOS USO DEL CONTROLADOR
const mp = require('../controller/materia_prima_controller.js');

//HACEMOS USO DE LOS MIDDLEWARES
const { existsMateriaPrima } = require('../middlewares/existsMateriaPrima');

//ENDPOINTS
router.put('/actualizarStock_MP/:id/:stock', existsMateriaPrima, mp.updateStock);
router.put('/actualizarPrecio_MP/:id/:precio', existsMateriaPrima, mp.updatePrecio);
router.get('/getMPByName', mp.getMPByName);
router.get('/getAllMP', mp.getAllMP);
router.put('/updateStock/:id', mp.updateStock);
router.delete('/deleteMP/:id', mp.deleteMP);

module.exports = router;