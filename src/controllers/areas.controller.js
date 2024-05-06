import { pool } from "../db.js";

export const obtenerAreas = async(req, res) => {
    const [result] = await pool.query("SELECT * FROM daem_areas")
    res.json(result)
}

export const crearAreas = async(req, res) => {
    const {nombre} = req.body
    const [rows] = await pool.query("INSERT INTO daem_areas(ar_nombre) VALUES (?)", nombre);

    res.sendStatus(204);

}

export const eliminarArea = async (req, res) => {
    const [result] = await pool.query(
        "DELETE FROM daem_areas WHERE ar_id = ?",
        req.params.id
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Area no eliminada",
    });
  else return res.sendStatus(204);
}

export const obtenerAreaPorId = async (req, res) => {
    const [result] = await pool.query(
        "SELECT * FROM daem_areas WHERE ar_id = ?",
        req.params.id
    )
    if (result.length <= 0)
    return res.status(404).json({
      message: "Area no encontrada",
    });
  else return res.json(result[0]);
}

export const actualizarArea = async (req, res) => {
    const [result] = await pool.query(
        "UPDATE daem_areas SET ar_nombre = ? WHERE ar_id = ?",
        [req.body.nombre, req.params.id]
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Area no actualizada",
    });
  else return res.sendStatus(204);
}