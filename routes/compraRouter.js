"use strict";

const express = require('express');
const router = express.Router();

//HACEMOS USO DEL CONTROLADOR
const compra = require('../controller/compra_controller.js');

//ENDPOINTS
router.post('/compra', compra.compra);

module.exports = router;