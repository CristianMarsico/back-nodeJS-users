"use strict";
const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica la presencia de un token de autenticación en las cabeceras de la solicitud y lo verifica.
 * También extrae la información del usuario del token y la adjunta al objeto de solicitud para su uso posterior.
 *
 * @param {object} req - El objeto de solicitud HTTP que debe contener el token de autenticación en las cabeceras.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta si el token es válido.
 *
 * @throws {Error} Si no se proporciona un token de autenticación o si hay problemas al verificar el token.
 *
 * Si el token es válido, extrae el payload del token y agrega propiedades `new_id`, `new_name` y `new_user` al objeto `req` para su uso posterior.
 * Si no se proporciona un token de autenticación en las cabeceras, responde con un código de estado 401 y un mensaje de error.
 * Si el token de autenticación es inválido, ha expirado o tiene un formato incorrecto, responde con un código de estado 401 y un mensaje de error correspondiente.
 */
exports.requiereToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        token = token.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "No Bearer" });

        let payload = jwt.verify(token, process.env.JWT_SECRET);

        //CREO PROPIEDADES NUEVAS AL REQ
        req.new_id = payload.id;
        req.new_name = payload.name;
        req.new_user = payload.user;

        next();
    } catch (e) {
        const errorsToken = {
            "invalid signature": "La firma J.W.T no es valida",
            "jwt expired": "J.W.T expirado",
            "invalid token": "Token invalido",
            "No Bearer": "Se necesita formato Bearer",
            "jwt malformed": "J.W.T formato no valido",
        }
        return res.status(401).json({ error: errorsToken[e.message] });
    }
}