"use strict";

const { response } = require('express');
const jwt = require('jsonwebtoken')

exports.requireRefreshToken = (req, res, next) => {


    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        console.log(refreshTokenCookie)
        if (!refreshTokenCookie) {
            throw new Error("No existe el token");
        }

        let payload = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        req.new_id = payload.id;
        req.new_name = payload.name
        req.new_user = payload.user

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