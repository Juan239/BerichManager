import { Router } from "express";
import {
  obtenerUsuarios,
  crearUsuarios,
  actualizarUsuarios,
  eliminarUsuario,
  obtenerUsuario,
} from "../controllers/usuarios.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"
import { validarRol } from "../middleware/verificarRol.middleware.js";

const router = Router();

router.get("/usuarios", validarToken, obtenerUsuarios);

router.get("/usuarios/:id", validarToken, obtenerUsuario);

router.post("/usuarios", validarToken, crearUsuarios);

router.put("/usuarios", validarToken, actualizarUsuarios);

router.delete("/usuarios/:id", validarToken, eliminarUsuario);

export default router;
