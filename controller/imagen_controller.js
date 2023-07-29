"use strict";
const conexion = require('../database/bd.js');
const { addImagen, getAll } = require('../model/imagen_model.js');


exports.add = ((req, res) => {
    console.log(req.file)

    try {
        const IMG = {
            nombre: req.file.originalname,
            descripcion: req.file.originalname,
            ruta_archivo: req.file.path
        };
        console.log(IMG)
        addImagen(IMG, conexion, res)

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});


exports.getAll = (async (req, res) => {
    try {
        let response = await getAll(conexion, res);
        if (response != null)
            return res.status(200).json({ response });

        return res.status(404).json({ error: "No hay imagenes en la base de datos" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});