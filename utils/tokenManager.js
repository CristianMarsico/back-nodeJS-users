"use strict";
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT con la información de usuario proporcionada.
 * @param {number} id - El ID del usuario.
 * @param {string} user - El nombre de usuario del usuario.
 * @param {string} name - El nombre del usuario.
 * @returns {object} Un objeto que contiene el token JWT y la duración del tiempo de vida del token.
 */
exports.generateToken = (id, user, name) => {
    try {
        let tiempoVidaToken = 60 * 30; //Una Hora

        //EL SIGN CONTIENE EL PAYLOAD QUE ES LA INFORMACION DEL USUARIO
        let token = jwt.sign({ id, user, name }, process.env.JWT_SECRET, { expiresIn: tiempoVidaToken });
        return { token, tiempoVidaToken }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Genera un token de actualización (refresh token) y configura una cookie en la respuesta HTTP.
 * @param {number} id - El ID del usuario.
 * @param {string} user - El nombre de usuario del usuario.
 * @param {string} name - El nombre del usuario.
 * @param {object} res - El objeto de respuesta HTTP utilizado para establecer la cookie.
 */
exports.generateRefreshToken = (id, user, name, res) => {
    let expiresIn = 60 * 30; //Una Hora
    try {
        let refreshToken = jwt.sign({ id, user, name }, process.env.JWT_REFRESH, { expiresIn });

        res.cookie("refreshToken", refreshToken, {
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000)
        });
    } catch (error) {
        console.log(error);
    }
}