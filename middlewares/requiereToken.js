"use strict";
const jwt = require('jsonwebtoken');

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