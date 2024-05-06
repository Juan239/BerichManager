import { pool } from "../db.js";

export const obtenerMarcas = async(req, res) => {
    const [result] = await pool.query("SELECT * FROM daem_marcas")
    res.json(result)
}

export const crearMarcas = async(req, res) => {
    const {nombre} = req.body
    const [rows] = await pool.query("INSERT INTO daem_marcas(ma_nombre) VALUES (?)", nombre);

    res.sendStatus(204);
}

export const eliminarMarca = async (req, res) => {
    const [result] = await pool.query(
        "DELETE FROM daem_marcas WHERE ma_id = ?",
        req.params.id
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Marca no eliminada",
    });
  else return res.sendStatus(204);
}

export const obtenerMarcaPorId = async (req, res) => {
    const [result] = await pool.query(
        "SELECT * FROM daem_marcas WHERE ma_id = ?",
        req.params.id
    )
    if (result.length <= 0)
    return res.status(404).json({
      message: "Marca no encontrada",
    });
  else return res.json(result[0]);
}

export const actualizarMarca = async (req, res) => {
    const [result] = await pool.query(
        "UPDATE daem_marcas SET ma_nombre = ? WHERE ma_id = ?",
        [req.body.nombre, req.params.id]
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Marca no actualizada",
    });
  else return res.sendStatus(204);
}