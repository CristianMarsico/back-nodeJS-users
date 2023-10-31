const bcrypt = require('bcryptjs');
const { queryAsync } = require('../database/bd2.js');

/**
 * Crea un usuario por defecto con el rol de superadministrador si no existe en la base de datos.
 * @async
 * @function crearUsuarioPorDefecto
 * @throws {Error} Lanza un error si ocurre un problema durante la creación del usuario por defecto.
 */
async function crearUsuarioPorDefecto() {
    const nombrePorDefecto = 'santiago';
    const usuarioPorDefecto = 'santiago';
    const pass = 'santiago';
    try {
        let passHash = await bcrypt.hash(pass, 8);
        const usuarioExists = await checkUserExistence(nombrePorDefecto, usuarioPorDefecto);

        if (!usuarioExists) {
            const nuevoUsuario = {
                nombre: 'santiago',
                pass: passHash,
                usuario: 'santiago',
                email: 'santiago@santiago.com',
            };

            const insertedUserId = await insertUser(nuevoUsuario);
            await assignSuperadminRole(insertedUserId);
            console.log('Usuario por defecto con rol de superadministrador creado con éxito.');
        } else {
            console.log('El usuario por defecto ya existe en la base de datos.');
        }
    } catch (error) {
        console.error('Error al crear el usuario por defecto:', error);
    }
}

/**
 * Verifica si un usuario con el nombre y nombre de usuario dados ya existe en la base de datos.
 * @async
 * @function checkUserExistence
 * @param {string} nombre - El nombre del usuario.
 * @param {string} usuario - El nombre de usuario del usuario.
 * @returns {boolean} `true` si el usuario existe, de lo contrario, `false`.
 */
async function checkUserExistence(nombre, usuario) {
    const query = 'SELECT id FROM usuario WHERE nombre = ? AND usuario = ?';
    const results = await queryAsync(query, [nombre, usuario]);
    return results.length > 0;
}


/**
 * Inserta un nuevo usuario en la base de datos.
 * @async
 * @function insertUser
 * @param {object} user - Los datos del nuevo usuario a insertar.
 * @returns {number} El ID del usuario insertado.
 */
async function insertUser(user) {
    const query = 'INSERT INTO usuario SET ?';
    const results = await queryAsync(query, user);
    return results.insertId;
}

/**
 * Asigna el rol de superadministrador a un usuario en la base de datos.
 * @async
 * @function assignSuperadminRole
 * @param {number} userId - El ID del usuario al que se le asignará el rol de superadministrador.
 */
async function assignSuperadminRole(userId) {
    const superadminRoleId = 1; // Ajusta el ID del rol de superadministrador según tu base de datos
    const query = 'INSERT INTO usuario_role (usuario_id, rol_id) VALUES (?, ?)';
    await queryAsync(query, [userId, superadminRoleId]);
}

module.exports = {
    crearUsuarioPorDefecto
};