import { pool } from "../db.js";

export const obtenerCategorias = async(req, res) => {
    const [result] = await pool.query("SELECT * FROM daem_categorias")
    res.json(result)
}

export const crearCategorias = async(req, res) => {
    const {nombre} = req.body
    const [rows] = await pool.query("INSERT INTO daem_categorias(cat_nombre) VALUES (?)", nombre);

    res.sendStatus(204);

}

export const eliminarCategoria = async (req, res) => {
    const [result] = await pool.query(
        "DELETE FROM daem_categorias WHERE cat_id = ?",
        req.params.id
    )
    if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Categoria no eliminada",
    });
  else return res.sendStatus(204);
}