import { pool } from "../../db.js";

export const obtenerTipoActivos = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM daem_tipoActivos");
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los tipos de activos",
        error: error.message,
      });
  }
};

export const crearTipoActivos = async (req, res) => {
  try {
    const { nombre } = req.body;

    const [result] = await pool.query(
      "INSERT INTO daem_tipoActivos (ac_nombre) VALUES (?)",
      [nombre]
    );
    res.status(200).json({ message: "Tipo de activo creado" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al crear el tipo de activo",
        error: error.message,
      });
  }
}

export const eliminarTipoActivos = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM daem_tipoActivos WHERE ac_id = ?",
      req.params.id
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Tipo de activo no eliminado",
      });
    else return res.sendStatus(200);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el tipo de activo",
        error: error.message,
      });
  }
}

export const actualizarTipoActivos = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE daem_tipoActivos SET ac_nombre = ? WHERE ac_id = ?",
      [nombre, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Tipo de activo no actualizado",
      });
    else return res.sendStatus(200);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el tipo de activo",
        error: error.message,
      });
  }
}

export const obtenerTipoActivoPorId = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM daem_tipoActivos WHERE ac_id = ?",
      req.params.id
    );
    if (result.length <= 0)
      return res.status(404).json({
        message: "Tipo de activo no encontrado",
      });
    else return res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener el tipo de activo",
        error: error.message,
      });
  }
}
