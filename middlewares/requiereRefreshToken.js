"use strict";
const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica y extrae el payload del token de actualización (refresh token) en las cookies de la solicitud.
 * @param {object} req - El objeto de solicitud HTTP que contiene las cookies con el refresh token.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta si el refresh token es válido.
 *
 * @throws {Error} Si el token de actualización no se encuentra en las cookies o si hay problemas al verificar el token.
 *
 * Si el refresh token es válido, extrae el payload del token y agrega propiedades `new_id`, `new_name` y `new_user` al objeto `req`.
 * Si el token de actualización no se encuentra en las cookies, responde con un código de estado 401 y un mensaje de error.
 * Si el token de actualización es inválido o ha expirado, responde con un código de estado 401 y un mensaje de error correspondiente.
 */
exports.requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie)
            throw new Error("No existe el token");

        let payload = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        req.new_id = payload.id;
        req.new_name = payload.name;
        req.new_user = payload.user;

        next();
    } catch (error) {

        const errorsToken = {
            "No existe el token": "El token no existe",
            "invalid signature": "La firma J.W.T no es valida",
            "jwt expired": "J.W.T expirado",
            "invalid token": "Token invalido",
            "No Bearer": "Se necesita formato Bearer",
            "jwt malformed": "J.W.T formato no valido",
        }
        return res.status(401).json({ error: errorsToken[error.message] });
    }
};