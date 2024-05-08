import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const obtenerCredenciales = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verificar si el token existe
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado. Token no proporcionado." });
  }

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, process.env.SECRET);
  
    // Extraer los datos del usuario del token decodificado
    const { userId, username, userRolInformatica, userRolBitacoras } = decoded;

    // Enviar los datos del usuario como respuesta
    res.status(200).json({ userId, username, userRolInformatica, userRolBitacoras });
  } catch (error) {
    console.error("Error al obtener las credenciales:", error);
    res
      .status(401)
      .json({ message: "Acceso no autorizado. Token inválido o expirado." });
  }
};
