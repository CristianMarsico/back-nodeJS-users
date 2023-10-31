"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Verifica si un hilado con el mismo producto terminado y color ya existe en la base de datos.
 * @param {string} producto_terminado - El producto terminado del hilado.
 * @param {string} color - El color del hilado.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de resultados o nulo si no se encontró un hilado.
 */
exports.existsHilado = (producto_terminado, color, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM hilado WHERE producto_terminado = ? AND color = ?';
        conexion.query(sql, [producto_terminado, color], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

/**
 * Obtiene la cantidad de stock de un hilado en una ubicación específica (stock_loberia o stock_buenosAires).
 * @param {number} producto_id - El ID del producto hilado.
 * @param {string} stock_origen - La ubicación de stock (stock_loberia o stock_buenosAires).
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en la cantidad de stock en la ubicación especificada o nulo si no se encontró el hilado.
 */
exports.getCantidadStockCiudad = (producto_id, stock_origen, res) => {
    return new Promise((resolve, reject) => {
        const totaStock = stock_origen === 'stock_loberia' ? 'stock_loberia' : 'stock_buenosAires';
        const sql = `SELECT ${totaStock} AS stock FROM hilado WHERE id = ?`;
        conexion.query(sql, [producto_id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener cantidad de stock' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            return resolve(null);
        });
    });
};

/**
 * Obtiene el precio comercial de un hilado para un tipo de venta específico (precio_venta_mayorista o precio_venta_minorista).
 * @param {number} producto_id - El ID del producto hilado.
 * @param {string} tipo_venta - El tipo de venta (precio_venta_mayorista o precio_venta_minorista).
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el precio comercial para el tipo de venta especificado o nulo si no se encontró el hilado.
 */
exports.getPrecioComercial = (producto_id, tipo_venta, res) => {
    return new Promise((resolve, reject) => {
        //CURDATE() -> DIA ACTUAL
        // const consulta = 'SELECT * FROM compra WHERE DAY(CURDATE()) = 17 and MONTH(fecha)= MONTH(CURDATE()) -1';
        const totaStock = tipo_venta === 'precio_venta_mayorista' ? 'precio_venta_mayorista' : 'precio_venta_minorista';
        const sql = `SELECT ${totaStock} AS precio FROM hilado WHERE id = ?`;
        conexion.query(sql, [producto_id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener cantidad de stock' });
                if (resultados.length > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                res.status(500).json("Error de conexion");
            }
        });
    });
};

/**
 * Agrega un nuevo hilado a la base de datos.
 * @param {object} HILADO - Los detalles del hilado a agregar.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.addHilado = (HILADO, res) => {
    conexion.query('INSERT INTO hilado SET ?', HILADO, (err, result) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la hilado:');
            return res.status(201).json(`Hilado agregado exitosamente! - id: ${result.insertId}`);
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
};


/**
 * Obtiene todos los hilados ordenados por producto terminado y color en orden ascendente.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de hilados o nulo si no se encontraron hilados.
 */
exports.getAllHilado = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM hilado ORDER BY producto_terminado, color ASC';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};


/**
 * Obtiene una lista de IDs de hilados y sus nombres de producto terminado.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de IDs y nombres de producto terminado o nulo si no se encontraron
*/
exports.getHiladoByName = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, producto_terminado FROM hilado';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};


/**
 * Transfiere stock entre ubicaciones de un hilado.
 * @param {number} id - El ID del hilado.
 * @param {number} cantidad_tranferida - La cantidad de stock a transferir.
 * @param {string} origen - La ubicación de origen del stock (stock_loberia o stock_buenosAires).
 * @param {string} destino - La ubicación de destino del stock (stock_loberia o stock_buenosAires).
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {object} El resultado de la operación de transferencia de stock.
 */
exports.transferStockBetweenLocations = (id, cantidad_tranferida, origen, destino, res) => {

    try {
        const updateOrigenQuery = `UPDATE hilado SET ${origen} = ${origen} - ? WHERE id = ?`;
        conexion.query(updateOrigenQuery, [cantidad_tranferida, id]);

        // Sumar la cantidad al destino
        const updateDestinoQuery = `UPDATE hilado SET ${destino} = ${destino} + ? WHERE id = ?`;
        conexion.query(updateDestinoQuery, [cantidad_tranferida, id]);
        conexion.commit();

        return res.status(201).json('Stock actualizado correctamente.');
    } catch (error) {
        conexion.rollback();
        return res.status(404).json({ error: 'Error al actulizar el Stock.' });
    }
};

/**
 * Modifica el precio de un hilado para un tipo de consumidor específico.
 * @param {number} id - El ID del hilado.
 * @param {number} monto - El nuevo monto del precio.
 * @param {string} tipoConsumidor - El tipo de consumidor (precio_venta_mayorista o precio_venta_minorista).
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la operación de modificación del precio.
 */
exports.modificarPrecio = (id, monto, tipoConsumidor, res) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE hilado SET ${tipoConsumidor} = ? WHERE id = ?`;
        conexion.query(sql, [monto, id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al modificar el precio' });
            }
            if (resultados.affectedRows > 0)
                return resolve(resultados);

            resolve(null);
        });
    });
};

/**
 * Incrementa la cantidad de mercadería en una ubicación específica de un hilado.
 * @param {number} id - El ID del hilado.
 * @param {number} total - La cantidad a incrementar.
 * @param {string} stock - La ubicación de stock a incrementar (stock_loberia o stock_buenosAires).
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la operación de incremento de mercadería.
 */
exports.incrementarMercaderia = (id, total, stock, res) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE hilado SET ${stock} = ${stock} + ? WHERE id = ?`;
        conexion.query(sql, [total, id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al incrementar mercaderia' });
            }
            if (resultados.affectedRows > 0)
                return resolve(resultados);

            resolve(null);
        });
    });
};