import { pool } from "../../db.js";

export const obtenerDestinos = async(req, res) => {
    const [result] = await pool.query("SELECT * FROM daem_destinos")
    res.json(result)
}

export const crearDestino = async(req, res) => {
    const {nombre} = req.body
    const [rows] = await pool.query("INSERT INTO daem_destinos(de_nombre) VALUES (?)", nombre);

    res.sendStatus(204);
}

export const eliminarDestino = async (req, res) => {
    const [result] = await pool.query(
        "DELETE FROM daem_destinos WHERE de_id = ?",
        req.params.id
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Destino no eliminado",
    });
  else return res.sendStatus(204);
}

export const obtenerDestinoPorId = async (req, res) => {
    const [result] = await pool.query(
        "SELECT * FROM daem_destinos WHERE de_id = ?",
        req.params.id
    )
    if (result.length <= 0)
    return res.status(404).json({
      message: "Destino no encontrado",
    });
  else return res.json(result[0]);
}

export const actualizarDestino = async (req, res) => {
    const [result] = await pool.query(
        "UPDATE daem_destinos SET de_nombre = ? WHERE de_id = ?",
        [req.body.nombre, req.params.id]
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Destino no actualizado",
    });
  else return res.sendStatus(204);
}