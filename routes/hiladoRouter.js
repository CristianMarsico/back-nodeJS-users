"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');


//HACEMOS USO DEL CONTROLADOR
const hilado = require('../controller/hilado_controller');

//HACEMOS USO DE LOS MIDDLEWARES
const { existsHilado } = require('../middlewares/existsHilado.js');


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage });



// const upload = multer({
//     storage: storage
// });



//ENDPOINTS
// router.post('/hilado', upload.single('imagen'), hilado.add);
router.post('/hilado', existsHilado, hilado.add);
router.get('/hilado', hilado.getAll);
router.get('/hiladoNombre', hilado.getHiladoByName);
router.put('/trasferirStock/:id', hilado.transferStockBetweenLocations);

module.exports = router;