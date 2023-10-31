const { queryAsync } = require('../database/bd2.js');


/**
 * Verifica la existencia de roles en la base de datos y, si no existen, los inserta.
 * @async
 * @function existsRoleInDataBase
 * @throws {Error} Lanza un error si ocurre un problema durante la verificación o inserción de roles.
 */
async function existsRoleInDataBase() {
    try {
        const count = await checkRoleCount();
        if (count === 0) {
            await insertDefaultRoles();
        } else {
            console.log('La tabla role ya contiene datos.');
        }
    } catch (error) {
        console.error('Error al verificar/insertar roles:', error);
    }
}


/**
 * Obtiene el número de roles en la tabla 'role' de la base de datos.
 * @async
 * @function checkRoleCount
 * @returns {number} El número de roles en la tabla 'role'.
 * @throws {Error} Lanza un error si ocurre un problema durante la consulta.
 */
async function checkRoleCount() {
    const query = 'SELECT COUNT(*) AS count FROM role';
    const results = await queryAsync(query);
    return results[0].count;
}


/**
 * Inserta roles predeterminados en la base de datos.
 * @async
 * @function insertDefaultRoles
 * @throws {Error} Lanza un error si ocurre un problema durante la inserción de roles.
 */
async function insertDefaultRoles() {
    const roles = [
        { tipo: 'super_admin' },
        { tipo: 'admin' },
        { tipo: 'default' }
    ];

    const query = 'INSERT INTO role (tipo) VALUES ?';
    const values = roles.map((role) => [role.tipo]);

    try {
        await queryAsync(query, [values]);
        console.log('Datos de roles insertados correctamente');
    } catch (error) {
        throw new Error('Error al insertar datos de roles: ' + error);
    }
}


module.exports = {
    existsRoleInDataBase
};