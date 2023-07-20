exports.addRol = (ROL, conexion, res) => {
    conexion.query('INSERT INTO usuario_role SET ?', ROL, (error) => {
        try {
            if (error) {
                console.error('Error al insertar el rol del usuario: ', error);
                return;
            }
            // res.status(201).json('Registro de rol creado exitosamente');
            return;
        } catch (error) {
            res.status(500).json('Error de conexion');
        }
    });

};

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