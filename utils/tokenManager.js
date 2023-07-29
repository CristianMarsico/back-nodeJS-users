"use strict";

const jwt = require('jsonwebtoken');


exports.generateToken = (id, user, name) => {
    try {
        let tiempoVidaToken = Math.floor(Date.now() / 1000) + (60 * 60); //Una Hora

        //EL SIGN CONTIENE EL PAYLOAD QUE ES LA INFORMACION DEL USUARIO
        let token = jwt.sign({ id, user, name }, process.env.JWT_SECRET, { expiresIn: tiempoVidaToken });
        return { token, tiempoVidaToken }
    } catch (e) {
        console.log(e);
    }
}

exports.generateRefreshToken = (id, user, name, res) => {
    let expiresIn = Math.floor(Date.now() / 1000) + (60 * 60); //Una Hora
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