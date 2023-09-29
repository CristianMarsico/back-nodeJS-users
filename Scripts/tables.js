"use strict";
const bcrypt = require('bcryptjs');
const conexion = require('../database/bd.js');

const usuario = `
CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  pass VARCHAR(200) NOT NULL,
  usuario VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL
)
`;

const role = `
CREATE TABLE IF NOT EXISTS role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50)
)
`;

const usuario_role = `
CREATE TABLE IF NOT EXISTS usuario_role (
  usuario_id INT,
  rol_id INT,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (rol_id) REFERENCES role(id)
)
`;

const materia_Prima = `
CREATE TABLE IF NOT EXISTS materia_prima(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL
)
`;

const enProduccion = `
CREATE TABLE IF NOT EXISTS enProduccion(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  stock INT NOT NULL,
  fecha DATE NOT NULL
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
    CREATE TABLE IF NOT EXISTS hilado (
      id INT AUTO_INCREMENT PRIMARY KEY,
      producto_terminado VARCHAR(150) NOT NULL,
      color VARCHAR(50) NOT NULL,
      stock_loberia INT NOT NULL,
      stock_buenosAires INT NOT NULL,
      precio_venta_mayorista DECIMAL(10, 2) NOT NULL,
      precio_venta_minorista DECIMAL(10, 2) NOT NULL
    )
  `;

// const imagen = `
//     CREATE TABLE IF NOT EXISTS imagen (
//        id_imagen INT AUTO_INCREMENT PRIMARY KEY,
//        nombre VARCHAR(100) NOT NULL,
//        ruta_archivo VARCHAR(255) NOT NULL,
//        producto_id INT,
//       FOREIGN KEY (producto_id) REFERENCES hilado(id)
//     )
//   `;

const venta = `
  CREATE TABLE IF NOT EXISTS venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre_prod VARCHAR(100) NOT NULL,
    color VARCHAR(100) NOT NULL,
    cantidad_vendida INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock_origen ENUM('stock_loberia', 'stock_buenosAires') NOT NULL,
    tipo_venta ENUM('precio_venta_mayorista', 'precio_venta_minorista') NOT NULL,
    fecha DATE NOT NULL,
    cliente VARCHAR(100) NOT NULL,
    medio_pago VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    telefono VARCHAR(100) NULL,
    FOREIGN KEY (producto_id) REFERENCES hilado(id)
  )
`;

const cliente = `
  CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    telefono VARCHAR(100) NULL
  )
`;


const tr_descontar_stock_hilado = `
CREATE TRIGGER tr_descontar_stock_hilado 
AFTER INSERT ON venta
FOR EACH ROW
BEGIN
    IF NEW.stock_origen = 'stock_loberia' THEN
        UPDATE hilado
        SET stock_loberia = stock_loberia - NEW.cantidad_vendida
        WHERE id = NEW.producto_id;
    ELSEIF NEW.stock_origen = 'stock_buenosAires' THEN
        UPDATE hilado
        SET stock_buenosAires = stock_buenosAires - NEW.cantidad_vendida
        WHERE id = NEW.producto_id;
    END IF;
END;
`;

const tr_compra_actualizarMateriaPrima = `
CREATE TRIGGER tr_compra_actualizarMateriaPrima 
AFTER INSERT ON compra FOR EACH ROW
BEGIN
  DECLARE stock_diff INT;
  SET stock_diff = NEW.cantidad;
  
  IF EXISTS (SELECT 1 FROM materia_prima WHERE nombre = NEW.producto) THEN
    UPDATE materia_prima SET stock = stock + stock_diff, precio = NEW.precio_unitario WHERE nombre = NEW.producto;
  ELSE
    INSERT INTO materia_prima (nombre, precio, stock) VALUES (NEW.producto, NEW.precio_unitario, stock_diff);
  END IF;
END;
;
`;

const tr_mp_cambiarNombreCompra = `
  CREATE TRIGGER tr_mp_cambiarNombreCompra
 AFTER UPDATE ON materia_prima FOR EACH ROW
BEGIN
  IF NEW.nombre != OLD.nombre THEN
    UPDATE compra SET producto = NEW.nombre WHERE producto = OLD.nombre;
     UPDATE enproduccion SET nombre = NEW.nombre WHERE nombre = OLD.nombre;
  END IF;
END;
`;


const tr_cargarCliente = `
  CREATE TRIGGER tr_cargarCliente
AFTER INSERT ON venta FOR EACH ROW
BEGIN
    DECLARE cliente_id INT;
    
    -- Verificar si el cliente ya existe
    SELECT id_cliente INTO cliente_id
    FROM cliente
    WHERE nombre = NEW.cliente;
    
    -- Si el cliente no existe, insertarlo
    IF cliente_id IS NULL THEN
        INSERT INTO cliente (nombre, direccion, email, telefono)
        VALUES (NEW.cliente, NEW.direccion, NEW.email, NEW.telefono);
    ELSE
      UPDATE cliente SET direccion = NEW.direccion, email = NEW.email, telefono = NEW.telefono WHERE nombre = NEW.cliente;   
    END IF;
END;
`;

eliminarTrigger("tr_descontar_stock_hilado")
  .then(() => {
    console.log('Trigger eliminado con éxito');
    // Realiza cualquier otra acción después de eliminar el trigger
  })
  .catch((error) => {
    console.error('Error al eliminar el trigger:', error);
  });
eliminarTrigger("tr_compra_actualizarMateriaPrima")
  .then(() => {
    console.log('Trigger eliminado con éxito');
    // Realiza cualquier otra acción después de eliminar el trigger
  })
  .catch((error) => {
    console.error('Error al eliminar el trigger:', error);
  });
eliminarTrigger("tr_mp_cambiarNombreCompra")
  .then(() => {
    console.log('Trigger eliminado con éxito');
    // Realiza cualquier otra acción después de eliminar el trigger
  })
  .catch((error) => {
    console.error('Error al eliminar el trigger:', error);
  });
eliminarTrigger("tr_cargarCliente")
  .then(() => {
    console.log('Trigger eliminado con éxito');
    // Realiza cualquier otra acción después de eliminar el trigger
  })
  .catch((error) => {
    console.error('Error al eliminar el trigger:', error);
  });

createTablesAndTriggers();
existsRoleInDataBase();

crearUsuarioPorDefecto();

function createTablesAndTriggers() {
  //CREACION DE TABLAS
  load(usuario, "USUARIO");
  load(role, "ROL");
  load(usuario_role, "USUARIO_ROL");
  load(materia_Prima, "MATERIA PRIMA");
  load(compra, "COMPRA");
  load(hilado, "HILADO");
  load(venta, "VENTA");
  // load(imagen, "IMAGEN");
  load(enProduccion, "EN_PRODUCCION");
  load(cliente, "CLIENTE");

  //CREACION DE TRIGGERS
  load(tr_compra_actualizarMateriaPrima, "TR_ACTUALIZAR_MATERIA_PRIMA");
  load(tr_descontar_stock_hilado, "TR_DESCONTAR_STOCK_HILADO");
  load(tr_mp_cambiarNombreCompra, "TR_CAMBIAR_NOMBRE_COMPRA");
  load(tr_cargarCliente, "TR_CARGAR_CLIENTE");
}

function load(tabla, nombre) {
  conexion.query(tabla, (error, results) => {
    if (error) throw error;
    console.log(`Tabla ${nombre} ha sido creada exitosamente.`);
  });
}

function existsRoleInDataBase() {
  // Consulta para verificar si existen datos en la tabla role
  const cantidad = 'SELECT COUNT(*) AS count FROM role';

  conexion.query(cantidad, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      console.log('La tabla role ya contiene datos.');
      return;
    }
    insertRole();
  });
}
function insertRole() {
  const roles = [
    { tipo: 'super_admin' },
    { tipo: 'admin' },
    { tipo: 'default' }
  ];

  const query = 'INSERT INTO role (tipo) VALUES ?';
  conexion.query(query, [roles.map(dato => [dato.tipo])], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
    } else {
      console.log('Datos insertados correctamente');
    }
  });
}

function eliminarTrigger(nombre) {
  return new Promise((resolve, reject) => {
    const query = `DROP TRIGGER IF EXISTS ${nombre}`;
    conexion.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}



// Función para crear un usuario por defecto con rol de superadministrador
async function crearUsuarioPorDefecto() {
  // Consulta para verificar si el usuario por defecto ya existe
  const consulta = 'SELECT id FROM usuario WHERE nombre = ? AND usuario = ?';
  const nombrePorDefecto = 'santiago';
  const usuarioPorDefecto = 'santiago';
  const pass = "santiago"

  let passHash = await bcrypt.hash(pass, 8);


  conexion.query(consulta, [nombrePorDefecto, usuarioPorDefecto], (error, resultados) => {
    if (error) {
      console.error('Error al verificar la existencia del usuario:', error);
      return;
    }

    if (resultados.length === 0) {
      // El usuario por defecto no existe, así que lo creamos
      const nuevoUsuario = {
        nombre: 'santiago',
        pass: passHash,
        usuario: 'santiago',
        email: 'santiago@santiago.com',
      };

      // Insertar el nuevo usuario en la tabla 'usuario'
      conexion.query('INSERT INTO usuario SET ?', nuevoUsuario, (errorInsertar, resu) => {
        if (errorInsertar) {
          console.error('Error al insertar el usuario:', errorInsertar);
        } else {
          // Obtener el ID del usuario recién insertado
          const usuarioId = resu.insertId;
          // Asignar el rol de superadministrador al usuario
          const asignarRolQuery = 'INSERT INTO usuario_role (usuario_id, rol_id) VALUES (?, ?)';
          const superadminRoleId = 1; // Ajusta el ID del rol de superadministrador según tu base de datos

          conexion.query(asignarRolQuery, [usuarioId, superadminRoleId], (errorAsignarRol) => {
            if (errorAsignarRol) {
              console.error('Error al asignar el rol de superadministrador:', errorAsignarRol);
            } else {
              console.log('Usuario por defecto con rol de superadministrador creado con éxito.');
            }
          });
        }
      });
    } else {
      console.log('El usuario por defecto ya existe en la base de datos.');
    }
  });
}

