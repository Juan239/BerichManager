import { Router } from "express";
import { obtenerEstablecimientos, crearEstablecimientos, eliminarEstablecimiento, obtenerEstablecimientoPorId, actualizarEstablecimiento } from "../controllers/general/establecimientos.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"
import { validarRol } from "../middleware/verificarRol.middleware.js";

const router = Router()

router.get("/establecimientos", validarToken, obtenerEstablecimientos)
router.post("/establecimientos", validarToken, crearEstablecimientos)
router.delete("/establecimientos/:id", validarToken, eliminarEstablecimiento)
router.get("/establecimientos/:id", validarToken, obtenerEstablecimientoPorId)
router.put("/establecimientos/:id", validarToken, actualizarEstablecimiento)


export default router