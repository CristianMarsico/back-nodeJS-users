const bcrypt = require('bcryptjs');
const { queryAsync } = require('../database/bd2.js');

async function crearUsuarioPorDefecto() {
    const nombrePorDefecto = 'santiago';
    const usuarioPorDefecto = 'santiago';
    const pass = 'santiago';
    // const consulta = 'SELECT id FROM usuario WHERE nombre = ? AND usuario = ?';

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

async function checkUserExistence(nombre, usuario) {
    const query = 'SELECT id FROM usuario WHERE nombre = ? AND usuario = ?';
    const results = await queryAsync(query, [nombre, usuario]);
    return results.length > 0;
}

async function insertUser(user) {
    const query = 'INSERT INTO usuario SET ?';
    const results = await queryAsync(query, user);
    return results.insertId;
}

async function assignSuperadminRole(userId) {
    const superadminRoleId = 1; // Ajusta el ID del rol de superadministrador según tu base de datos
    const query = 'INSERT INTO usuario_role (usuario_id, rol_id) VALUES (?, ?)';
    await queryAsync(query, [userId, superadminRoleId]);
}

module.exports = {
    crearUsuarioPorDefecto
};