"use strict";
const express = require('express');
const router = express.Router();
//HACEMOS USO DEL CONTROLADOR
const hilado = require('../controller/hilado_controller');
//HACEMOS USO DE LOS MIDDLEWARES
const { requiereToken } = require('../middlewares/requiereToken.js');
const { existsHilado } = require('../middlewares/existsHilado.js');

// Ruta para obtener todos los elementos de hilado
router.get('/hilado', requiereToken, hilado.getAll);

// Ruta para obtener elementos de hilado por nombre
router.get('/hiladoNombre', requiereToken, hilado.getHiladoByName);

// Ruta para agregar un nuevo elemento de hilado
router.post('/hilado', requiereToken, existsHilado, hilado.add);

// Ruta para transferir stock entre ubicaciones para un elemento de hilado
router.put('/trasferirStock/:id', requiereToken, hilado.transferStockBetweenLocations);

// Ruta para modificar el precio de un elemento de hilado
router.put('/cambiarPrecio/:id', requiereToken, hilado.modificarPrecio);

// Ruta para incrementar la mercadería de un elemento de hilado
router.put('/incrementarMercaderia/:id', requiereToken, hilado.incrementarMercaderia);


module.exports = router;