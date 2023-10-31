"use strict";

/**
 * Obtiene un usuario por nombre, usuario y tipo de rol.
 * @param {string} name - El nombre del usuario.
 * @param {string} user - El nombre de usuario.
 * @param {string} tipo_rol - El tipo de rol del usuario.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los datos del usuario o nulo si no se encontró.
 */
exports.getUserBy_Name_And_User_And_Rol = ((name, user, tipo_rol, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT u.nombre, u.usuario, r.tipo FROM usuario u, role r, usuario_role ur WHERE u.id = ur.usuario_id AND ur.rol_id = r.id AND u.nombre = ? AND u.usuario = ? AND r.tipo = ?`;
        conexion.query(sql, [name, user, tipo_rol], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json('Error al obtener el usuario');
                if (resultados.length > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json("Error de conexion");
            }
        });
    });
});

/**
 * Obtiene un usuario por nombre y nombre de usuario.
 * @param {string} name - El nombre del usuario.
 * @param {string} user - El nombre de usuario.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los datos del usuario o nulo si no se encontró.
 */
exports.getUserByNameAndUserName = ((name, user, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM usuario WHERE nombre = ? AND usuario = ?';
        conexion.query(sql, [name, user], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json('Error al obtener el usuario');
                if (resultados.length > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json("Error de conexion");
            }
        });
    });
});

/**
 * Agrega un usuario a la base de datos.
 * @param {object} USUARIO - Los datos del usuario a agregar.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.addUser = (USUARIO, conexion, res) => {
    conexion.query('INSERT INTO usuario SET ?', USUARIO, (err, resultados) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la usuario');
            return;
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
};

/**
 * Elimina un usuario por su ID.
 * @param {number} id - El ID del usuario a eliminar.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la eliminación o nulo si no se encontró.
 */
exports.deleteUser = ((id, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM usuario WHERE id = ?';
        conexion.query(sql, [id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al eliminar el usuario' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});

/**
 * Actualiza el nombre de usuario de un usuario por su ID.
 * @param {number} id - El ID del usuario a actualizar.
 * @param {string} nombre - El nuevo nombre de usuario.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la actualización o nulo si no se encontró.
 */
exports.updateUser = ((id, nombre, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE usuario SET usuario= ? WHERE id = ?';
        conexion.query(sql, [nombre, id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al editar usuario' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});

