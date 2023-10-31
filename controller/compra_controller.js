"use strict";

const { addCompra, getAllCompras } = require('../model/compra_model.js');

/**
 * Registra una compra en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos de la compra.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Registra una compra en la base de datos con los detalles proporcionados, incluyendo el producto, cantidad, precio unitario y fecha de la compra. Responde con un mensaje de éxito si la compra se registra correctamente o un mensaje de error si hay problemas con los datos o la fecha de la compra.
 */
exports.compra = ((req, res) => {
    try {
        const COMPRA = {
            producto: req.body.producto.toLowerCase(),
            cantidad: req.body.cantidad,
            precio_unitario: req.body.precio_unitario,
            total: req.body.precio_unitario * req.body.cantidad,
            fecha: req.body.fecha,  // Asegúrate de usar el formato 'YYYY-MM-DD'
        };

        if (COMPRA.cantidad <= 0)
            return res.status(404).json({ error: "La cantidad debe ser mayor a cero" });

        if (COMPRA.precio_unitario <= 0)
            return res.status(404).json({ error: "El precio por unidad debe ser mayor a cero" });

        const fechaActual = new Date();
        const formattedFechaActual = fechaActual.toISOString().split('T')[0];
        if (COMPRA.fecha > formattedFechaActual)
            return res.status(404).json({ error: 'Revise la fecha. No puede registrar compras futuras' });
        addCompra(COMPRA, res);
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Obtiene todas las compras registradas en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene todas las compras registradas en la base de datos y responde con una lista de compras si se encuentran registros. En caso contrario, responde con un mensaje de error.
 */
exports.getAll = (async (req, res) => {
    try {

        let response = await getAllCompras(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay compras registradas" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});