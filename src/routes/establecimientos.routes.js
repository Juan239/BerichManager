import { Router } from "express";
import { obtenerEstablecimientos, crearEstablecimientos, eliminarEstablecimiento } from "../controllers/establecimientos.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"
import { validarRol } from "../middleware/verificarRol.middleware.js";

const router = Router()

router.get("/establecimientos", validarToken, obtenerEstablecimientos)
router.post("/establecimientos", validarToken, crearEstablecimientos)
router.delete("/establecimientos/:id", validarToken, eliminarEstablecimiento)


export default router