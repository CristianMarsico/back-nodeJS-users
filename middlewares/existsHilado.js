"use strict";
const { existsHilado } = require('../model/hilado_model.js');

/**
 * Middleware que verifica si un hilado con un producto terminado y color específico existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la verificación.
 *
 * Si el hilado no existe en la base de datos, llama a la función `next` para permitir que la solicitud continúe.
 * Si el hilado existe, responde con un código de estado 404 y un mensaje de error.
 */
exports.existsHilado = (async (req, res, next) => {

    let producto_terminado = req.body.producto_terminado;
    let color = req.body.color;
    try {
        let productoExistente = await existsHilado(producto_terminado, color, res);
        let existe = productoExistente[0].count > 0;
        if (!existe)
            return next();
        return res.status(404).json({ error: 'El hilado existe en la base de datos' });
    } catch (e) {
        console.log("error");
    }
});