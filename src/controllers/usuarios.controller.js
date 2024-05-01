import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const obtenerUsuarios = async (req, res) => {
  const [result] = await pool.query("SELECT * FROM daem_usuarios");
  res.json(result);
};

export const obtenerUsuario = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT usr_id, usr_username as username, usr_nombre as nombre, usr_apellido as apellido, usr_rol as rol FROM daem_usuarios WHERE usr_id = ?",
    req.params.id
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Usuarios no encontrado",
    });
  else return res.json(rows[0]);
};

export const crearUsuarios = async (req, res) => {
  const { username, password, nombre, apellido} = req.body;
  let rol = req.body.rol;

  if(rol === true){
    rol = 'admin'
  }
  else{
    rol = 'normal'
  }

  try {
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el número de rondas de hash

    // Inserta el usuario en la base de datos con la contraseña hasheada
    const [rows] = await pool.query(
      "INSERT INTO daem_usuarios(usr_username, usr_contrasena, usr_nombre, usr_apellido, usr_rol) VALUES(?,?,?,?,?)",
      [username, hashedPassword, nombre, apellido, rol]
    );

    res.send({
      id: rows.insertId,
      username,
      nombre,
      apellido,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
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

export const actualizarUsuarios = async (req, res) => {
  const id = req.params.id;
  const { username, password, nombre, apellido } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let rol = req.body.rol;
  let result;
  if(rol === true){
    rol = 'admin'
  }
  else{
    rol = 'normal'
  }

  if (password === "") {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_nombre = ?, usr_apellido = ?, usr_rol = ? WHERE usr_id = ?",
      [username, nombre, apellido, rol, id]
    );
  } else {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_contrasena = ?, usr_nombre = ?, usr_apellido = ?, usr_rol = ? WHERE usr_id = ?",
      [username, hashedPassword, nombre, apellido, rol, id]
    );
  }

  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Usuario no encontrado" });
  else {
    return res.status(200).json({ message: "Usuario editado correctamente" });
  }
};
