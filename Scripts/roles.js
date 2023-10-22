const { queryAsync } = require('../database/bd2.js');

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

async function checkRoleCount() {
    const query = 'SELECT COUNT(*) AS count FROM role';
    const results = await queryAsync(query);
    return results[0].count;
}

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