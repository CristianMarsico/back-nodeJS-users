"use strict";

const { addComentario, getAllComentarios, deleteComentario } = require('../model/comentarioModel.js');



/**
 * Registra un comentario en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos del comentario.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Registra un comentario en la base de datos con los detalles proporcionados.
 */

exports.addComentario = ((req, res) => {
    try {
        const COMENTARIO = {
            comentario: req.body.comentario.toLowerCase(),
            id_cliente: req.body.id_cliente,
        };

        addComentario(COMENTARIO, res);
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});


/**
 * Obtiene todas los comentarios registrados en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene todas los comentarios registrados en la base de datos y responde con una lista de comentarios si se encuentran registros. En caso contrario, responde con un mensaje de error.
 */
exports.getAll = (async (req, res) => {
    try {
        const { id } = req.params;
        let response = await getAllComentarios(id, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay cometarios registrados" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});



/**
 * Elimina un comentario que se encuentra en produccion por su ID.
 * @param {number} id - ID de la materia prima.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la eliminación o nulo si no se encontró el registro.
 */
exports.deleteComentario = (async (req, res) => {

    const ids = req.params.id.split(',').map(id => parseInt(id));
   
    try {
        let response = await deleteComentario(ids, res)
        if (response != null)
            return res.status(200).json(`Observaciones borradas con éxito !`);
        else
            res.status(404).json({ error: "Error: No se ha podido eliminar" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})