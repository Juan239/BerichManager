import { pool } from "../../db.js";

export const obtenerOrdenTrabajo = async (req, res) => {
  const [result] = await pool.query(
    'SELECT ot_id, daem_ordenestrabajo.ot_fecha AS "fecha", daem_categorias.cat_nombre AS "titulo", CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) AS "nombre", daem_establecimientos.est_nombre AS "establecimiento" , daem_intervenciones.int_nombre AS "intervencion" FROM daem_ordenestrabajo INNER JOIN daem_usuarios ON daem_ordenestrabajo.ot_responsable = daem_usuarios.usr_id INNER JOIN daem_establecimientos ON daem_ordenestrabajo.ot_establecimiento = daem_establecimientos.est_id INNER JOIN daem_intervenciones ON daem_ordenestrabajo.ot_intervencion = daem_intervenciones.int_id INNER JOIN daem_categorias ON daem_ordenestrabajo.ot_titulo = daem_categorias.cat_id ORDER BY ot_id DESC;'
  );
  res.json(result);
};

export const crearOrdenTrabajo = async (req, res) => {
  const {
    fecha,
    titulo,
    establecimiento,
    intervencion,
    descripcion,
    observaciones,
    responsable,
  } = req.body;

  const [rows] = await pool.query(
    "INSERT INTO daem_ordenestrabajo(ot_fecha, ot_titulo, ot_descripcion, ot_observaciones, ot_responsable, ot_establecimiento, ot_intervencion)VALUES (?,?,?,?,?,?,?)",
    [
      fecha,
      titulo,
      descripcion,
      observaciones,
      responsable,
      establecimiento,
      intervencion,
    ]
  );
  res.sendStatus(204);
};

export const eliminarOrdenTrabajo = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM daem_ordenestrabajo WHERE ot_id = ?",
    req.params.id
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Orden de trabajo no eliminada",
    });
  else return res.sendStatus(204);
};

export const actualizarOrdentrabajo = async (req, res) => {
  const id = req.params.id;
  const {
    fecha,
    titulo,
    descripcion,
    observaciones,
    establecimiento,
    intervencion,
  } = req.body;

  const [result] = await pool.query(
    "UPDATE daem_ordenestrabajo SET ot_fecha = ?, ot_titulo = ?, ot_descripcion = ?, ot_observaciones = ?, ot_establecimiento = ?, ot_intervencion = ? WHERE ot_id = ?",
    [
      fecha,
      titulo,
      descripcion,
      observaciones,
      establecimiento,
      intervencion,
      id,
    ]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Orden no encontrado" });
  else {
    return res.status(200).json({ message: "Orden editada correctamente" });
  }
};

export const obtenerOrdenPorId = async (req, res) => {
  const id = req.params.id;
  const [result] = await pool.query("SELECT * FROM daem_ordenestrabajo WHERE ot_id = ?", id)
  res.json(result);
}
