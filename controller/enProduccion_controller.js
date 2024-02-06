"use strict";
const { getAllEnProduccion, deleteEnProduccion } = require('../model/enProduccion_model.js');

/**
 * Obtiene todos los elementos en producción registrados en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene todos los elementos en producción registrados en la base de datos y responde con una lista de estos elementos si se encuentran registros. En caso contrario, responde con un mensaje de error.
 */
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


/**
 * Elimina una materia prima que se encuentra en produccion por su ID.
 * @param {number} id - ID de la materia prima.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la eliminación o nulo si no se encontró el registro.
 */
exports.deleteEnProduccion = (async (req, res) => {

    const { id } = req.params;
    try {
        let response = await deleteEnProduccion(id, res)
        if (response != null)
            return res.status(200).json(`Materia prima en prduccion borrado con éxito`);
        else
            res.status(404).json({ error: "Error: No se ha podido eliminar" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})