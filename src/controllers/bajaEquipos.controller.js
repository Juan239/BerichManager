import { pool } from "../db.js";

export const obtenerBajaEquipos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT be_id, be_fecha as fecha, daem_tipoActivos.ac_nombre as tipoActivo, daem_establecimientos.est_nombre as ubicacion, CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) AS nombre FROM daem_bajaEquipos INNER JOIN daem_tipoActivos ON daem_bajaEquipos.be_tipoActivo = daem_tipoActivos.ac_id INNER JOIN daem_establecimientos ON daem_bajaEquipos.be_ubicacion = daem_establecimientos.est_id INNER JOIN daem_usuarios ON daem_bajaEquipos.be_responsable = daem_usuarios.usr_id ORDER BY be_id DESC;');
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos dados de baja', error: error.message });
  }
}

export const crearBajaEquipos = async (req, res) => {
  try {
    const {
        fecha,
        tipoActivo,
        marca,
        modelo,
        ubicacion,
        relacionSolicitud,
        detalle,
        conceptoTecnico,
        responsable,
    } = req.body;
    
    const [rows] = await pool.query(
        "INSERT INTO daem_bajaEquipos(be_fecha, be_tipoActivo, be_marca, be_modelo, be_ubicacion, be_responsable, be_relacionSolicitud, be_detalle, be_conceptoTecnico) VALUES (?,?,?,?,?,?,?,?,?)",
        [
        fecha,
        tipoActivo,
        marca,
        modelo,
        ubicacion,
        responsable,
        relacionSolicitud,
        detalle,
        conceptoTecnico,
        ]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el equipo dado de baja', error: error.message });
  }
}

export const eliminarBajaEquipos = async (req, res) => {
  try {
    const [result] = await pool.query(
        "DELETE FROM daem_bajaEquipos WHERE be_id = ?",
        req.params.id
    );
    if (result.affectedRows <= 0)
        return res.status(404).json({
        message: "Baja de equipo no eliminada",
        });
    else return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo dado de baja', error: error.message });
  }
}

export const actualizarBajaEquipos = async (req, res) => {
  try {
    const id = req.params.id;
    const {
        fecha,
        tipoActivo,
        marca,
        modelo,
        ubicacion,
        responsable,
        relacionSolicitud,
        detalle,
        conceptoTecnico,
    } = req.body;

    const [result] = await pool.query(
        "UPDATE daem_bajaEquipos SET be_fecha = ?, be_tipoActivo = ?, be_marca = ?, be_modelo = ?, be_ubicacion = ?, be_responsable = ?, be_relacionSolicitud = ?, be_detalle = ?, be_conceptoTecnico = ? WHERE be_id = ?",
        [
        fecha,
        tipoActivo,
        marca,
        modelo,
        ubicacion,
        responsable,
        relacionSolicitud,
        detalle,
        conceptoTecnico,
        id,
        ]
    );
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al actualizar el equipo dado de baja', error: error.message });
  }
}

export const obtenerBajaEquiposPorId = async (req, res) => {
  try {
    const [result] = await pool.query(
        "SELECT * FROM daem_bajaEquipos WHERE be_id = ?",
        req.params.id
    );
    if (result.length <= 0)
        return res.status(404).json({
        message: "Baja de equipo no encontrada",
        });
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el equipo dado de baja por ID', error: error.message });
  }
}

/*
Consulta para obtener todos los datos (para el pdf sirve)
SELECT be_id, be_fecha as fecha, daem_tipoActivos.ac_nombre as tipoActivo, be_modelo as modelo, daem_establecimientos.est_nombre as ubicacion, CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) AS nombre, be_relacionSolicitud as relacionSolicitud, be_detalle as detalle, be_conceptoTecnico as conceptoTecnico FROM daem_bajaEquipos INNER JOIN daem_tipoActivos ON daem_bajaEquipos.be_tipoActivo = daem_tipoActivos.ac_id INNER JOIN daem_establecimientos ON daem_bajaEquipos.be_ubicacion = daem_establecimientos.est_id INNER JOIN daem_usuarios ON daem_bajaEquipos.be_responsable = daem_usuarios.usr_id ORDER BY be_id DESC; */