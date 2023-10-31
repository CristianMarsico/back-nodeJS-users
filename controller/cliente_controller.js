"use strict";
const { getAllClientes, updateCliente } = require('../model/cliente_model.js');

/**
 * Obtiene todos los clientes registrados en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene todos los clientes registrados en la base de datos y responde con una lista de clientes si se encuentran registros. En caso contrario, responde con un mensaje de error.
 */
exports.getAll = (async (req, res) => {
    try {
        let response = await getAllClientes(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay ventas registradas" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Actualiza los datos de un cliente por su ID.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos del cliente a actualizar.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Actualiza los datos de un cliente identificado por su ID con la nueva dirección, correo electrónico y número de teléfono proporcionados. Responde con un mensaje de éxito si la actualización es exitosa, o un mensaje de error si no se puede actualizar el cliente.
 */
exports.update = (async (req, res) => {

    const { id } = req.params;
    const direccion = req.body.direccion.toLowerCase();
    const email = req.body.email.toLowerCase();
    const telefono = req.body.telefono;
    try {
        let response = await updateCliente(direccion, email, telefono, id, res)
        if (response != null)
            return res.status(200).json(`Cliente actualizado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar al cliente" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})