import { pool } from "../../db.js";
import bcrypt from "bcryptjs";

export const obtenerUsuarios = async (req, res) => {
  const [result] = await pool.query("SELECT * FROM daem_usuarios");
  res.json(result);
};

export const obtenerUsuario = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT usr_id, usr_username as username, usr_nombre as nombre, usr_apellido as apellido, usr_rut as rut, usr_rol_informatica as rol_informatica, usr_rol_bitacoras as rol_bitacoras, usr_area as area FROM daem_usuarios WHERE usr_id = ?",
    req.params.id
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Usuarios no encontrado",
    });
  else return res.json(rows[0]);
};

export const obtenerColaboradores = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT usr_id, concat(usr_nombre,' ', usr_apellido) as nombre FROM daem_usuarios WHERE usr_area = '1'"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener colaboradores:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

export const crearUsuarios = async (req, res) => {
  const { username, password, nombre, apellido, rut, area } = req.body;
  let rolInformatica = req.body.rolInformatica;
  let rolBitacoras = req.body.rolBitacoras;

  if (rolInformatica === true) {
    rolInformatica = "admin";
  } else {
    rolInformatica = "usuario";
  }

  if (rolBitacoras === true) {
    rolBitacoras = "admin";
  } else {
    rolBitacoras = "usuario";
  }

  try {
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el número de rondas de hash

    // Inserta el usuario en la base de datos con la contraseña hasheada
    const [rows] = await pool.query(
      "INSERT INTO daem_usuarios(usr_username, usr_contrasena, usr_nombre, usr_apellido, usr_rut, usr_rol_informatica, usr_rol_bitacoras, usr_area) VALUES(?,?,?,?,?,?,?,?)",
      [username, hashedPassword, nombre, apellido, rut, rolInformatica, rolBitacoras, area]
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
  const { username, password, nombre, apellido, rut, area } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let result;
  let rolInformatica = req.body.rolInformatica;
  let rolBitacoras = req.body.rolBitacoras;

  if (rolInformatica === true) {
    rolInformatica = "admin";
  } else {
    rolInformatica = "usuario";
  }

  if (rolBitacoras === true) {
    rolBitacoras = "admin";
  } else {
    rolBitacoras = "usuario";
  }

  if (password === "") {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_nombre = ?, usr_apellido = ?, usr_rut = ?, usr_rol_informatica = ?, usr_rol_bitacoras = ?, usr_area = ? WHERE usr_id = ?",
      [username, nombre, apellido, rut, rolInformatica, rolBitacoras, area, id]
    );
  } else {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_contrasena = ?, usr_nombre = ?, usr_apellido = ?, usr_rut = ?, usr_rol_informatica = ?, usr_rol_bitacoras = ?, usr_area = ? WHERE usr_id = ?",
      [
        username,
        hashedPassword,
        nombre,
        apellido,
        rut,
        rolInformatica,
        rolBitacoras,
        area,
        id,
      ]
    );
  }

  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Usuario no encontrado" });
  else {
    return res.status(200).json({ message: "Usuario editado correctamente" });
  }
};

export const obtenerConductores = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT usr_id, usr_nombre, usr_apellido, usr_rut, usr_username FROM daem_usuarios WHERE usr_area = '2'"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

export const crearConductores = async (req, res) => {
  const { username, password, rut, nombre, apellido } = req.body;
  try {
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el número de rondas de hash

    // Inserta el usuario en la base de datos con la contraseña hasheada
    const [rows] = await pool.query(
      "INSERT INTO daem_usuarios(usr_username, usr_contrasena, usr_rut, usr_nombre, usr_apellido, usr_area) VALUES(?,?,?,?,?,?)",
      [username, hashedPassword, rut, nombre, apellido, 2]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

export const actualizarConductores = async (req, res) => {
  const id = req.params.id;
  const { username, password, rut, nombre, apellido } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let result;
  if (password === "") {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_rut = ?, usr_nombre = ?, usr_apellido = ? WHERE usr_id = ?",
      [username, rut, nombre, apellido, id]
    );
  } else {
    result = await pool.query(
      "UPDATE daem_usuarios SET usr_username = ?, usr_contrasena = ?, usr_rut = ?, usr_nombre = ?, usr_apellido = ? WHERE usr_id = ?",
      [username, hashedPassword, rut, nombre, apellido, id]
    );
  }

  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Usuario no encontrado" });
  else {
    return res.status(200).json({ message: "Usuario editado correctamente" });
  }
}