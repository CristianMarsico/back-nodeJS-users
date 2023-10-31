"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Obtiene todos los clientes ordenados alfabéticamente por nombre.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de clientes o nulo si no se encuentran clientes.
 *
 * Recupera una lista de todos los clientes desde la base de datos y los ordena alfabéticamente por nombre. Los resultados se devuelven como una matriz de objetos de cliente si se encuentran clientes, o como nulo si no se encontraron clientes.
 */
exports.getAllClientes = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente ORDER BY nombre ASC';
        conexion.query(sql, (err, resultados) => {
            if (err)
                return res.status(404).json({ error: 'Error al obtener los clientes' });

            if (resultados.length > 0)
                return resolve(resultados);

            resolve(null);
        });
    });
};


/**
 * Actualiza los datos de un cliente por su ID.
 * @param {string} direccion - La dirección del cliente.
 * @param {string} email - El correo electrónico del cliente.
 * @param {string} telefono - El número de teléfono del cliente.
 * @param {number} id - El ID del cliente a actualizar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la actualización o nulo si no se encontró el cliente.
 *
 * Actualiza la información de un cliente específico en la base de datos. Se requiere proporcionar la dirección, el correo electrónico y el número de teléfono actualizados, así como el ID del cliente que se va a actualizar. La promesa resuelve en los resultados de la actualización si se realizó con éxito o en nulo si no se encontró el cliente.
 */
exports.updateCliente = ((direccion, email, telefono, id, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE cliente SET direccion=?, email=? ,telefono=? WHERE id_cliente=?';
        conexion.query(sql, [direccion, email, telefono, id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al edtiar' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});
