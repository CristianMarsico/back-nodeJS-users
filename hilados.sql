/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cliente
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: compra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `compra` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto` varchar(50) NOT NULL,
  `cantidad` decimal(10, 3) NOT NULL,
  `precio_unitario` decimal(10, 2) NOT NULL,
  `total` decimal(10, 2) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enproduccion
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enproduccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `stock` decimal(10, 3) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hilado
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hilado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_terminado` varchar(150) NOT NULL,
  `color` varchar(50) NOT NULL,
  `stock_loberia` decimal(10, 3) NOT NULL,
  `stock_buenosAires` decimal(10, 3) NOT NULL,
  `precio_venta_mayorista` decimal(10, 2) NOT NULL,
  `precio_venta_minorista` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: materia_prima
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `materia_prima` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10, 2) NOT NULL,
  `stock` decimal(10, 3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: role
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `pass` varchar(200) NOT NULL,
  `usuario` varchar(150) NOT NULL,
  `email` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario_role
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario_role` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  PRIMARY KEY (`usuario_id`, `rol_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_role_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_role_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `role` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `venta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `nombre_prod` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `cantidad_vendida` decimal(10, 3) NOT NULL,
  `precio` decimal(10, 2) NOT NULL,
  `stock_origen` enum('stock_loberia', 'stock_buenosAires') NOT NULL,
  `tipo_venta` enum(
  'precio_venta_mayorista',
  'precio_venta_minorista'
  ) NOT NULL,
  `fecha` date NOT NULL,
  `cliente` varchar(100) NOT NULL,
  `medio_pago` varchar(100) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `hilado` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cliente
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: compra
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enproduccion
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hilado
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: materia_prima
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: role
# ------------------------------------------------------------

INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (1, 'super_admin');
INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (2, 'admin');
INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (3, 'default');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

INSERT INTO
  `usuario` (`id`, `nombre`, `pass`, `usuario`, `email`)
VALUES
  (
    1,
    'santiago',
    '$2a$08$MEU2uN/3WAoyA48c0chb.eRwZ0wDbznS6J6jWfbOp7sl8GYyOY1gm',
    'santiago',
    'santiago@santiago.com'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario_role
# ------------------------------------------------------------

INSERT INTO
  `usuario_role` (`usuario_id`, `rol_id`)
VALUES
  (1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_compra_actualizarMateriaPrima
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_compra_actualizarMateriaPrima;
DELIMITER ;;
CREATE TRIGGER tr_compra_actualizarMateriaPrima 
                    AFTER INSERT ON compra FOR EACH ROW
                    BEGIN
                    DECLARE stock_diff DECIMAL(10, 3);
                    SET stock_diff = NEW.cantidad;
  
                    IF EXISTS (SELECT 1 FROM materia_prima WHERE nombre = NEW.producto) THEN
                        UPDATE materia_prima SET stock = stock + stock_diff, precio = NEW.precio_unitario WHERE nombre = NEW.producto;
                    ELSE
                        INSERT INTO materia_prima (nombre, precio, stock) VALUES (NEW.producto, NEW.precio_unitario, stock_diff);
                    END IF;
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_mp_cambiarNombreCompra
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_mp_cambiarNombreCompra;
DELIMITER ;;
CREATE TRIGGER tr_mp_cambiarNombreCompra
                    AFTER UPDATE ON materia_prima FOR EACH ROW
                    BEGIN
                    IF NEW.nombre != OLD.nombre THEN
                        UPDATE compra SET producto = NEW.nombre WHERE producto = OLD.nombre;
                        UPDATE enproduccion SET nombre = NEW.nombre WHERE nombre = OLD.nombre;
                    END IF;
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_descontar_stock_hilado
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_descontar_stock_hilado;
DELIMITER ;;
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
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_cargarCliente
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_cargarCliente;
DELIMITER ;;
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
                    END;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
