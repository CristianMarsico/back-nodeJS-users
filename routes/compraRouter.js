"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');


//HACEMOS USO DEL CONTROLADOR
const compra = require('../controller/compra_controller.js');

//ENDPOINTS
router.post('/compra', requiereToken, compra.compra);

module.exports = router;