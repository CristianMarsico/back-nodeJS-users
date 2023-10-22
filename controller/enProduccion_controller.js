"use strict";

const { getAllEnProduccion } = require('../model/enProduccion_model.js');

exports.getAll = (async (req, res) => {
    try {

        let response = await getAllEnProduccion(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay mp en produccion" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});