"use strict";
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

exports.getUserByNameAndUserName = ((name, user, conexion, res) => {
    return new Promise((resolve, reject) => {
        //CURDATE() -> DIA ACTUAL
        // const consulta = 'SELECT * FROM compra WHERE DAY(CURDATE()) = 17 and MONTH(fecha)= MONTH(CURDATE()) -1';
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


exports.addUser = (USUARIO, conexion, res) => {
    conexion.query('INSERT INTO usuario SET ?', USUARIO, (err, resultados) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la usuario');
            // res.status(201).json(`Usuario agregado exitosamente! - id: ${resultados.insertId}`);
            return;
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
};