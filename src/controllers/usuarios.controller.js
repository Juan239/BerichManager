import { pool } from "../db.js";
import bcrypt from "bcryptjs";


export const obtenerUsuarios = async (req, res) => {
  const [result] = await pool.query("SELECT * FROM daem_usuarios");
  res.json(result);
};

export const obtenerUsuario = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM daem_usuarios WHERE usr_id = ?",
    req.params.id
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Usuarios no encontrado",
    });
  else return res.json(rows[0]);
};

export const crearUsuarios = async (req, res) => {
  const { username, password, nombre, apellido } = req.body;

  try {
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el número de rondas de hash

    // Inserta el usuario en la base de datos con la contraseña hasheada
    const [rows] = await pool.query(
      "INSERT INTO daem_usuarios(usr_username, usr_contrasena, usr_nombre, usr_apellido) VALUES(?,?,?,?)",
      [username, hashedPassword, nombre, apellido]
    );

    res.send({
      id: rows.insertId,
      username,
      nombre,
      apellido,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

export const eliminarUsuario = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM daem_usuarios WHERE usr_id = ?",
    req.params.id
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Usuarios no eliminado",
    });
  else return res.sendStatus(204);
};

export const actualizarUsuarios = (req, res) => res.send("Actualizar usuarios");
