"use strict";

const jwt = require('jsonwebtoken')

exports.requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        if (!refreshTokenCookie) throw new Error("No existe el token");

        let payload = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        req.new_id = payload.id;
        req.new_name = payload.name
        req.new_user = payload.user

        next();
    } catch (error) {
        console.log(error);
        const errorsToken = {
            "invalid signature": "La firma J.W.T no es valida",
            "jwt expired": "J.W.T expirado",
            "invalid token": "Token invalido",
            "No Bearer": "Se necesita formato Bearer",
            "jwt malformed": "J.W.T formato no valido",
        }
        return res.status(401).send({ error: errorsToken[e.message] });
    }
};