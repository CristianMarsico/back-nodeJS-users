"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');


//HACEMOS USO DEL CONTROLADOR
const hilado = require('../controller/hilado_controller');
//HACEMOS USO DE LOS MIDDLEWARES
const { requiereToken } = require('../middlewares/requiereToken.js');
const { existsHilado } = require('../middlewares/existsHilado.js');

//ENDPOINTS
// router.post('/hilado', upload.single('imagen'), hilado.add);
router.get('/hilado', requiereToken, hilado.getAll);
router.get('/hiladoNombre', requiereToken, hilado.getHiladoByName);

router.post('/hilado', requiereToken, existsHilado, hilado.add);

router.put('/trasferirStock/:id', requiereToken, hilado.transferStockBetweenLocations);
router.put('/cambiarPrecio/:id', requiereToken, hilado.modificarPrecio);
router.put('/incrementarMercaderia/:id', requiereToken, hilado.incrementarMercaderia);


module.exports = router;