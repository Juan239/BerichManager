// Importar los módulos necesarios
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

// Configurar las variables de entorno
config();

// Función para verificar el usuario y generar el token de acceso
export const verificarUsuario = async (req, res) => {
  const usernameReq = req.body.username;
  const passwordReq = req.body.password;

  try { 
    // Consultar la base de datos para obtener los datos del usuario
    const [result] = await pool.query(
      "SELECT usr_id, usr_username, usr_contrasena, usr_rol FROM daem_usuarios WHERE usr_username = ?",
      usernameReq
    );

    // Verificar si se encontró un usuario con el nombre de usuario proporcionado
    if (result.length > 0) {
      const userId = result[0].usr_id;
      const usernameDB = result[0].usr_username;
      const userRol = result[0].usr_rol;
      const hashedPassword = result[0].usr_contrasena;

      // Deshashear la contraseña almacenada en la base de datos
      const isPasswordValid = await bcrypt.compare(passwordReq, hashedPassword);

      if (isPasswordValid) {
        // Generar el token de acceso incluyendo la ID del usuario y el nombre de usuario en el payload
        const accessToken = generateAccessToken(userId, usernameDB, userRol);

        // Enviar el token y el nombre de usuario en la respuesta JSON
        res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token: accessToken,
          rol: userRol
        });
      } else {
        // Contraseña incorrecta
        res.json({
          success: false,
          message: "Usuario o contraseña incorrectos",
        });
      }
    } else {
      // No se encontró ningún usuario con el nombre de usuario proporcionado
      res.json({ success: false, message: "Usuario no encontrado" });
    }
  }  catch (error) {
    // Error al ejecutar la consulta SQL
    console.error("Error al ejecutar la consulta SQL:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// Función para generar el token de acceso incluyendo la ID del usuario y el nombre de usuario en el payload
function generateAccessToken(userId, username, userRol) {
  return jwt.sign({ userId: userId, username: username, userRol: userRol }, process.env.SECRET, {
    expiresIn: "9h",
  });
}
