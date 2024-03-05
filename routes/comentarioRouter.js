"use strict";

const express = require('express');
const router = express.Router();
const { requiereToken } = require('../middlewares/requiereToken.js');

//HACEMOS USO DEL CONTROLADOR
const comentario = require('../controller/comentarioController.js');

// Ruta para agregar un comentario
router.post('/addComentario', requiereToken, comentario.addComentario);

// Ruta para obtener todos los comentarios
router.get('/getAllComentarios/:id', requiereToken, comentario.getAll);

// Ruta para eliminar un comentario
router.delete('/deleteComentario/:id', requiereToken, comentario.deleteComentario);

module.exports = router;