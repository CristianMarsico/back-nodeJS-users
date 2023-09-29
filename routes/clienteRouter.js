"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const cliente = require('../controller/cliente_controller.js');

router.get('/getAllClientes', requiereToken, cliente.getAll);
router.put('/updateCliente/:id', requiereToken, cliente.update);

module.exports = router;