"use strict";

const express = require('express');
const router = express.Router();

const path = require('path');

//HACEMOS USO DEL CONTROLADOR
const img = require('../controller/imagen_controller.js');

//ENDPOINTS
router.get('/imagenes', img.getAll);

module.exports = router;