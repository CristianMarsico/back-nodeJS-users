const conexion = require('../database/bd.js')

const usuario_1 = `
CREATE TABLE IF NOT EXISTS usuario_1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  pass VARCHAR(200) NOT NULL,
  usuario VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL
)
`;

const role_1 = `
CREATE TABLE IF NOT EXISTS role_1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50)
)
`;

const usuario_role_1 = `
CREATE TABLE IF NOT EXISTS usuarios_role_1 (
  usuario_id INT,
  rol_id INT,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario_1(id),
  FOREIGN KEY (rol_id) REFERENCES role_1(id)
)
`;

const materia_Prima = `
CREATE TABLE IF NOT EXISTS materia_prima(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  stock INT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL
)
`;

const compra = `
CREATE TABLE IF NOT EXISTS compra(
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  fecha DATE NOT NULL
  )
`;

const hilado = `
    CREATE TABLE IF NOT EXISTS producto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      producto_terminado VARCHAR(50) NOT NULL,
      stock_loberia INT NOT NULL,
      stock_buenosAires INT NOT NULL,
      precio_venta_mayorista DECIMAL(10, 2) NOT NULL,
      precio_venta_minorista DECIMAL(10, 2) NOT NULL
    )
  `;


// const tr_control_stock_mp = `
//   CREATE OR REPLACE TRIGGER tr_control_stock_mp
//   BEFORE UPDATE ON materia_prima
//   FOR EACH ROW
//   BEGIN
//     IF NEW.stock < 0 THEN
//         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El stock no puede ser negativo';
//     ELSEIF NEW.stock < OLD.stock THEN
//         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El stock actual es inferior al stock a retirar';
//     END IF;
//   END;
//   ;
// `;

const tr_compra_actualizarMateriaPrima = `

CREATE OR REPLACE TRIGGER tr_compra_actualizarMateriaPrima 
AFTER INSERT ON compra
FOR EACH ROW
BEGIN
  DECLARE cantidad INT;
  DECLARE stock_actual INT;
  
  SELECT NEW.cantidad INTO cantidad;
  
  SELECT stock INTO stock_actual
  FROM materia_prima
  WHERE nombre = NEW.producto;
  
  IF stock_actual IS NULL THEN
    -- La materia prima no existe, se debe agregar
    INSERT INTO materia_prima (nombre, stock, precio)
    VALUES (NEW.producto, cantidad, NEW.precio_unitario);
    
  ELSE
    -- La materia prima existe, se debe actualizar el stock
    UPDATE materia_prima
    SET stock = stock + cantidad
    WHERE nombre = NEW.producto;
    
  END IF;
END;
;
`;


createTables();
existsRoleInDataBase();

function createTables() {
  loadTables(usuario_1, "USUARIO");
  loadTables(role_1, "ROL");
  loadTables(usuario_role_1, "USUARIO_ROL");
  loadTables(materia_Prima, "MATERIA PRIMA");
  loadTables(compra, "COMPRA");
  loadTables(hilado, "HILADO");
  // loadTables(tr_control_stock_mp, "TR_CONTROL_STOCK_MATERIA_PRIMA");
  loadTables(tr_compra_actualizarMateriaPrima, "TR_ACTUALIZAR_MATERIA_PRIMA");
}

function loadTables(tabla, nombre) {
  conexion.query(tabla, (error, results) => {
    if (error) throw error;
    console.log(`Tabla ${nombre} ha sido creada exitosamente.`);
  });
}

function existsRoleInDataBase() {
  // Consulta para verificar si existen datos en la tabla role_1
  const cantidad = 'SELECT COUNT(*) AS count FROM role_1';

  // Ejecuta la consulta
  conexion.query(cantidad, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      // conexion.end();
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      console.log('La tabla role_1 ya contiene datos.');
      // conexion.end();
      return;
    }
    insertRole();
    // conexion.end();
  });
}

// Carga de Roles predeterminada 
function insertRole() {
  const roles = [
    { tipo: 'super_admin' },
    { tipo: 'admin' },
    { tipo: 'default' }
    // Agrega más datos según tus necesidades
  ];

  // Consulta SQL para insertar los datos
  const query = 'INSERT INTO role_1 (tipo) VALUES ?';

  // Ejecutar la consulta con los datos
  conexion.query(query, [roles.map(dato => [dato.tipo])], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
    } else {
      console.log('Datos insertados correctamente');
    }
    //Cerrar la conexión
    // conexion.end();
  });
}
