"use strict";

const jwt = require('jsonwebtoken')


exports.generateToken = (id, user, name) => {
    try {
        let tiempoVidaToken = 60 * 1 // 60 seg (1 min) * 15 = total = 15 min

        //EL SIGN CONTIENE EL PAYLOAD QUE ES LA INFORMACION DEL USUARIO
        let token = jwt.sign({ id, user, name }, process.env.JWT_SECRET, { expiresIn: tiempoVidaToken })
        return { token, tiempoVidaToken }
    } catch (e) {
        console.log(e)
    }
}

exports.generateRefreshToken = (id, user, name, res) => {
    let expiresIn = 60 * 3;
    try {
        let refreshToken = jwt.sign({ id, user, name }, process.env.JWT_REFRESH, { expiresIn })


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000)
        })
    } catch (error) {
        console.log(error)
    }
}