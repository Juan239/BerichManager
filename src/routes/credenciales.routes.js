import {Router} from "express";
import {obtenerCredenciales} from "../controllers/obtenerCredenciales.controller.js"
import { validarToken } from "../middleware/verificarToken.middleware.js";
import { validarRol } from "../middleware/verificarRol.middleware.js";

const router = Router()

router.get("/credenciales", validarToken, obtenerCredenciales)

export default router