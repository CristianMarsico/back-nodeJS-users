"use strict";
const conexion = require('../database/bd.js');
const { getAllClientes, updateCliente } = require('../model/cliente_model.js');

exports.getAll = (async (req, res) => {
    try {

        let response = await getAllClientes(conexion, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay ventas registradas" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

exports.update = (async (req, res) => {

    const { id } = req.params;
    const direccion = req.body.direccion.toLowerCase();
    const email = req.body.email.toLowerCase();
    const telefono = req.body.telefono;
    try {

        let response = await updateCliente(direccion, email, telefono, id, conexion, res)
        if (response != null)
            return res.status(200).json(`Cliente actualizado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar al cliente" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})