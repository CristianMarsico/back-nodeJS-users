"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const cliente = require('../controller/cliente_controller.js');

// Ruta para obtener todos los clientes
router.get('/getAllClientes', requiereToken, cliente.getAll);

// Ruta para actualizar un cliente por su ID
router.put('/updateCliente/:id', requiereToken, cliente.update);

module.exports = router;