"use strict";
const { validationResult } = require('express-validator')

/**
 * Middleware que verifica si hay errores de validación en la solicitud.
 * Utiliza el módulo 'express-validator' para validar los campos de la solicitud.
 * Si se encuentran errores de validación, responde con un código de estado 400 y un mensaje de error.
 *
 * @param {object} req - El objeto de solicitud HTTP que debe ser validado.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta si la validación es exitosa.
 *
 * @throws {Error} Si se producen errores en la validación de la solicitud.
 *
 * Verifica si existen errores de validación en la solicitud utilizando el módulo 'express-validator'.
 * Si se encuentran errores de validación, responde con un código de estado 400 y un mensaje de error que describe el primer error encontrado.
 * Si no se encuentran errores de validación, pasa el control al siguiente middleware o ruta.
 */
exports.validatorReqExpress = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({ "error": errorMsg })
    }
    next();
}