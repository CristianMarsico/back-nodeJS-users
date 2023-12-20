"use strict";
const bcrypt = require('bcryptjs');
const { conexion } = require('../database/bd2.js');
const { addRol, verificarExistenciaRol } = require('../model/rol_model.js');
const { getUserByNameAndUserName, addUser, deleteUser, updateUser } = require('../model/userModel.js');
const { generateToken, generateRefreshToken } = require('../utils/tokenManager.js');
const { performDatabaseBackup } = require('../database/bd2.js');



/**
 * Registra un nuevo usuario en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos del usuario a registrar.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Registra un nuevo usuario en la base de datos. Los datos del usuario se proporcionan en el cuerpo de la solicitud. Se verifica si el rol especificado existe y se crea si no existe. Luego, se verifica si el usuario ya existe y se le asigna el rol. Se responde con un mensaje de éxito una vez que se complete el proceso.
 */
exports.register = (async (req, res) => {

    try {
        let tipoRol = req.body.tipo;
        let password = req.body.pass;
        let passHash = await bcrypt.hash(password, 8);

        const USUARIO = {
            nombre: req.body.nombre.toLowerCase(),
            pass: passHash,
            usuario: req.body.usuario.toLowerCase(),
            email: req.body.email,
        }

        if (!tipoRol) {
            let id_rol = await verificarExistenciaRol("default", conexion, res);
            verificarYCrearUsuario(USUARIO, id_rol, conexion, res)
        }
        else {
            let id_rol = await verificarExistenciaRol(tipoRol, conexion, res);
            verificarYCrearUsuario(USUARIO, id_rol, conexion, res)
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error de servidor" })
    }
})


/**
 * Verifica la existencia de un usuario y crea un nuevo usuario si no existe.
 * @param {object} USUARIO - Los datos del usuario a crear o verificar.
 * @param {number} id_rol - El ID del rol a asignar al usuario.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Verifica si un usuario con el nombre y usuario proporcionados existe en la base de datos. Si el usuario no existe, se crea un nuevo usuario y se le asigna el rol especificado. Se responde con un mensaje de éxito indicando si se creó el usuario y el rol o si solo se creó el rol.
 */
const verificarYCrearUsuario = (async (USUARIO, id_rol, conexion, res) => {

    if (id_rol != null) {
        let existsUser = await getUserByNameAndUserName(USUARIO.nombre, USUARIO.usuario, conexion, res);
        if (existsUser != null) {
            crearRol(existsUser[0].id, id_rol, conexion, res);
            return res.status(201).json(`Rol creado exitosamente!`);
        } else {
            addUser(USUARIO, conexion, res);
            let user = await getUserByNameAndUserName(USUARIO.nombre, USUARIO.usuario, conexion, res);
            crearRol(user[0].id, id_rol, conexion, res);
            return res.status(201).json(`Usuario y rol creados exitosamente!`);
        }
    }
    else
        res.status(404).json('No existe ese rol en la base de datos');
});


/**
 * Crea un nuevo rol y lo asigna a un usuario.
 * @param {number} id_user - El ID del usuario al que se asignará el rol.
 * @param {number} id_rol - El ID del rol a asignar.
 * @param {object} conexion - La conexión a la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Crea un nuevo rol y lo asigna a un usuario específico utilizando sus IDs. Se utiliza en el proceso de verificación y creación de usuarios y roles.
 */
function crearRol(id_user, id_rol, conexion, res) {
    if (id_user && id_rol) {
        const ROL = {
            usuario_id: id_user,
            rol_id: id_rol // ID del rol por defecto
        };
        addRol(ROL, conexion, res);
    }
}


/**
 * Inicia sesión de usuario y genera tokens de autenticación.
 * @param {object} req - El objeto de solicitud HTTP que contiene las credenciales de inicio de sesión.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Inicia sesión de un usuario utilizando las credenciales proporcionadas. Se verifica la identidad del usuario y se generan tokens de autenticación. Estos tokens se devuelven en la respuesta junto con los datos del usuario y su rol.
 */
exports.login = (async (req, res) => {

    try {
        const user = req.body.usuario.toLowerCase()
        const pass = req.body.pass

        conexion.query('SELECT * FROM usuario WHERE usuario = ?', [user], async (error, results) => {
            if (results.length == 0 || ! await bcrypt.compare(pass, results[0].pass)) {
                if (error == null)
                    return res.status(404).json({ error: "Usuario o password incorrecto" })
            }

            let { id, usuario, nombre, email } = results[0]

            let rol = []
            const sql = 'SELECT r.tipo FROM usuario_role ur, role r WHERE ur.rol_id = r.id AND ur.usuario_id = ?';
            conexion.query(sql, [id], (error, r) => {
                if (error)
                    return res.json(error)

                r.forEach(e => {
                    rol.push({ tipo: e.tipo })
                });

                //GENERAR TOKEN
                const { token, tiempoVidaToken } = generateToken(id, usuario, nombre)
                generateRefreshToken(id, usuario, nombre, res)
                return res.json({ token, tiempoVidaToken, id, usuario, nombre, rol, email })
            })
        })
    } catch (e) {
        return res.status(500).json({ error: "Error de servidor" })
    }
})


/**
 * Obtiene los detalles de un usuario por su ID.
 * @param {object} req - El objeto de solicitud HTTP que contiene el ID del usuario.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene los detalles de un usuario en la base de datos utilizando su ID. Se responde con los datos del usuario si se encuentra, o con un mensaje de error si no se encuentra el usuario.
 */
exports.getUserByID = ((req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM usuario WHERE id = ?'
    conexion.query(sql, [id], (err, results) => {

        try {
            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Error de servidor' });
            if (results.length === 0)  // Si el usuario no existe
                throw new Error("No existe usuario con ese id ")
            else {
                let user = results[0].usuario
                let nombre = results[0].nombre
                res.status(200).json({ id, user, nombre })
            }
        } catch (e) {
            return res.status(401).json({ error: e.message });
        }
    })
})


/**
 * Obtiene todos los usuarios de la base de datos.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Obtiene todos los usuarios de la base de datos y los responde como una matriz de resultados. Si no se encuentran usuarios, se responde con un mensaje de error.
 */
exports.getAllUser = ((req, res) => {
    let id = req.new_id
    let sql = 'SELECT * FROM usuario'
    conexion.query(sql, [id], (err, results) => {

        try {
            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Error de servidor' });
            if (results.length === 0)  // Si el usuario no existe
                throw new Error("No existen usuarios en la BD ")
            else
                res.status(200).json({ results })
        } catch (e) {
            return res.status(401).json({ error: e.message });
        }
    })
})

/**
 * Refresca un token de autenticación.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos del usuario para generar un nuevo token.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Refresca un token de autenticación válido utilizando los datos del usuario proporcionados. Se genera un nuevo token y se responde con el nuevo token y su tiempo de vida.
 */
exports.refreshToken = (req, res) => {

    try {
        const { token, tiempoVidaToken } = generateToken(req.new_id, req.new_user, req.new_name);
        return res.status(200).json({ token, expiresIn: tiempoVidaToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error de server" });
    }
}

/**
 * Cierra la sesión de usuario y elimina el token de refresco.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Cierra la sesión de usuario y elimina el token de refresco, lo que requiere al usuario volver a autenticarse. Responde con un mensaje de éxito.
 */
exports.logout = async (req, res) => {
    await performDatabaseBackup();
    res.clearCookie('refreshToken');
    res.json({ logout: true })
}

/**
 * Elimina un usuario de la base de datos por su ID.
 * @param {object} req - El objeto de solicitud HTTP que contiene el ID del usuario a eliminar.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Elimina un usuario de la base de datos utilizando su ID. Responde con un mensaje de éxito si se realiza la eliminación o con un mensaje de error si no se encuentra el usuario.
 */
exports.deleteUser = (async (req, res) => {

    const { id } = req.params;
    try {
        let response = await deleteUser(id, conexion, res)
        console.log(response)
        if (response != null)  // un error indica que hubo problemas con la consulta
            return res.status(200).json(`Usuario borrado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido eliminar el usuario" })
    } catch (error) {
        return res.status(500).json({ error: "Error de server" });
    }
})

/**
 * Actualiza el nombre de usuario de un usuario por su ID.
 * @param {object} req - El objeto de solicitud HTTP que contiene el ID del usuario y el nuevo nombre de usuario.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Actualiza el nombre de usuario de un usuario utilizando su ID y el nuevo nombre de usuario proporcionado en la solicitud. Responde con un mensaje de éxito si se realiza la actualización o con un mensaje de error si no se encuentra el usuario.
 */
exports.updateUser = (async (req, res) => {

    const { id, } = req.params;
    const usuario = req.body.usuario.toLowerCase()
    try {
        let response = await updateUser(id, usuario, conexion, res);
        if (response != null)  // un error indica que hubo problemas con la consulta
            return res.status(200).json(`Usuario actualizado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar el usuario" })
    } catch (error) {
        return res.status(500).json({ error: "Error de server" });
    }
})

