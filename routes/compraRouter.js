"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');


//HACEMOS USO DEL CONTROLADOR
const compra = require('../controller/compra_controller.js');

//ENDPOINTS
router.post('/compra', requiereToken, compra.compra);
router.get('/getAllCompras', requiereToken, compra.getAll);

module.exports = router;