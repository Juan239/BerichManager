//NO BORRAR ESTE ARCHIVO, LA MANERA DE OBTENER EL ROL EN EL FRONTEND CAMBIO PERO
//SE OCUPARA ESTE ARCHIVO SOLAMENTE PARA VERIFICAR EL ROL AL MOMENTO DE REALIZAR ACCIONES (CRUD)
//NO OLVIDAR MODIFICAR ESTO PARA QUE HAGA LO QUE SE MENCIONA EN LA LINEA ANTERIOR
import jwt from "jsonwebtoken";

export function validarRol(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado. Token inválido o expirado." });
    } else {
      // Decodificar el token y almacenar la información en el objeto req.user si es necesario
      req.user = decoded;

      // Verificar el rol del usuario
      const usrRol = decoded.userRolInformatica;
      if (usrRol === "usuario") {
        console.log("USUARIO NORMAL")
        return res.status(200).json({ rol: "usuario" });
      } else if (usrRol === "admin") {
        //Cambie el return por el sendStatus, si hay error puede ser esto
        console.log("ADMIN")
        res.sendStatus(200).json({ rol: "admin" });
        next();
      } else {
        console.log("No se encuentra el rol");
        console.log("asdasd");
        return res.status(403).json({ message: "Rol de usuario no válido." });
      }

      
    }
  });
}
