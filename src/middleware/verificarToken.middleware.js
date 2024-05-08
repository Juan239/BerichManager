import jwt from "jsonwebtoken";

export function validarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado. Token no proporcionado." });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Acceso no autorizado. Token inválido o expirado." });
    } else {
      // Decodificar el token y almacenar la información en el objeto req.user si es necesario
      req.user = decoded;

      const usrRol = decoded.userRolInformatica;
      if (usrRol === "usuario") {
        req.userRol = "usuario"
       
      } else if (usrRol === "admin") {
        //Cambie el return por el sendStatus, si hay error puede ser esto
        req.userRol = "admin"
        
      } else {
        console.log("No se encuentra el rol");
        return res.status(403).json({ message: "Rol de usuario no válido." });
      }
      next();
      
    }
  });
}

/*
Problema del rol solucionado, el error era que estaba intentando enviar dos veces un json con el rol, aca en el middleware no tengo que enviar nada,
el controlador de obtener credenciales es el encargado de verificar el rol del usuario y mandarlo al front
*/