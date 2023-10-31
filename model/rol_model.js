"use strict"

/**
 * Agrega un rol de usuario a la base de datos.
 * @param {object} ROL - Los datos del rol a agregar.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.addRol = (ROL, conexion, res) => {
    conexion.query('INSERT INTO usuario_role SET ?', ROL, (error) => {
        try {
            if (error) {
                console.error('Error al insertar el rol del usuario: ', error);
                return;
            }
            return;
        } catch (error) {
            res.status(500).json('Error de conexion');
        }
    });
};

/**
 * Verifica la existencia de un rol en la base de datos por su tipo.
 * @param {string} rol - El tipo de rol a verificar.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el ID del rol o nulo si no se encontró.
 */
exports.verificarExistenciaRol = (rol, conexion, res) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role WHERE tipo = ?';
        conexion.query(query, [rol], (error, results) => {
            try {
                if (error)
                    return res.status(404).json('Error al obtener el rol');
                else {
                    if (results.length > 0)
                        return resolve(results[0].id);
                    else
                        return resolve(null);
                }
            } catch (error) {
                return res.status(500).json('Error de conexion');
            }
        });
    });
};