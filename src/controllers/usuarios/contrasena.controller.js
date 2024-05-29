import jwt from "jsonwebtoken";
import { pool } from "../../db.js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

export const cambiarContrasena = async (req, res) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const userId = decoded.userId;

    const { contrasenaActual, nuevaContrasena } = req.body;

    const [result] = await pool.query(
      "SELECT usr_contrasena FROM daem_usuarios WHERE usr_id = ?",
      userId
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasenaActual,
      result[0].usr_contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await pool.query(
      "UPDATE daem_usuarios SET usr_contrasena = ? WHERE usr_id = ?",
      [hashedPassword, userId]
    );

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: error.message});
  }
};
