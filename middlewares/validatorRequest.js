"use strict";

const { validationResult } = require('express-validator')

exports.validatorReqExpress = (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return res.status(400).json({ "error": errorMsg })
    }

    next();
}