// scripts/createTablesAndTriggers.js
const { queryAsync } = require('../database/bd2.js');
const tables = require('./tables2.js');
const triggers = require('./triggers.js');

/**
 * Elimina un desencadenador de la base de datos por su nombre.
 * @async
 * @function eliminarTrigger
 * @param {string} nombre - El nombre del desencadenador a eliminar.
 * @throws {Error} Lanza un error si ocurre un problema durante la eliminación del desencadenador.
 */
async function eliminarTrigger(nombre) {
    const query = `DROP TRIGGER IF EXISTS ${nombre}`;
    await queryAsync(query, `trigger ${nombre} eliminado`)
}

/**
 * Crea tablas y desencadenadores en una base de datos.
 * @async
 * @function createTablesAndTriggers
 * @throws {Error} Lanza un error si ocurre un problema durante la creación.
 */
async function createTablesAndTriggers() {

    try {
        for (const trigger of triggers) {
            eliminarTrigger(trigger.name)
                .then(() => {
                    console.log(`Trigger ${trigger.name} eliminado con éxito`);
                })
                .catch((error) => {
                    console.error('Error al eliminar el trigger:', error);
                });
        }

        for (const table of tables) {
            await createTable(table.name, table.definition);
            console.log(`Tabla ${table.name} creada exitosamente.`);
        }

        for (const trigger of triggers) {
            await createTable(trigger.name, trigger.definition);
            console.log(`Trigger ${trigger.name} creado exitosamente.`);
        }

    } catch (error) {
        console.error("Error al crear tablas y triggers:", error);
    }
}


/**
 * Crea una tabla en la base de datos con el nombre y definición especificados.
 * @async
 * @function createTable
 * @param {string} name - El nombre de la tabla que se va a crear.
 * @param {string} definition - La definición de la tabla en forma de consulta SQL.
 * @throws {Error} Lanza un error si ocurre un problema durante la creación de la tabla.
 */
async function createTable(name, definition) {
    const createTableQuery = definition;
    await queryAsync(createTableQuery, `Crear tabla ${name}`);
}

module.exports = {
    createTablesAndTriggers
};