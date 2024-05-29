import { Router } from "express";
import {
  obtenerUsuarios,
  crearUsuarios,
  actualizarUsuarios,
  eliminarUsuario,
  obtenerUsuario,
  obtenerConductores,
  crearConductores,
  actualizarConductores,
  obtenerColaboradores
} from "../controllers/usuarios/usuarios.controller.js";
import { cambiarContrasena } from "../controllers/usuarios/contrasena.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"
//import { validarRol } from "../middleware/verificarRol.middleware.js";

const router = Router();

router.get("/usuarios", validarToken, obtenerUsuarios);

router.get("/usuarios/:id", validarToken, obtenerUsuario);

router.post("/usuarios", validarToken, crearUsuarios);

router.put("/usuarios/:id", validarToken, actualizarUsuarios);

router.delete("/usuarios/:id", validarToken, eliminarUsuario);

router.get("/conductores", validarToken, obtenerConductores);

router.post("/conductores", validarToken, crearConductores);

router.put("/conductores/:id", validarToken, actualizarConductores);

router.get("/colaboradores" , validarToken, obtenerColaboradores)

router.post("/cambiarContrasena", validarToken, cambiarContrasena);

export default router;
