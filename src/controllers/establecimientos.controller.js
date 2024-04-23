import { pool } from "../db.js";

export const obtenerEstablecimientos = async (req, res) => {
  const [result] = await pool.query("SELECT * FROM daem_establecimientos");
  res.json(result);
};
export const crearEstablecimientos = async (req, res) => {
  const { nombre } = req.body;
  const [rows] = await pool.query(
    "INSERT INTO daem_establecimientos(est_nombre) VALUES (?)",
    nombre
  );

  res.sendStatus(204);
};

export const eliminarEstablecimiento = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM daem_establecimientos WHERE est_id = ?",
    req.params.id
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Establecimiento no eliminado",
    });
  else return res.sendStatus(204);
};
