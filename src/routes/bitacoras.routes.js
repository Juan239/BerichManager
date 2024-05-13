import { Router } from "express";
import { completarViaje, crearViaje, eliminarViaje, obtenerBitacoras, editarViaje, obtenerViajePorId} from "../controllers/bitacoras/bitacoras.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"

const router = Router();

router.get("/bitacoras", validarToken, obtenerBitacoras);

router.get("/bitacoras/:id", validarToken, obtenerViajePorId);

router.post("/bitacoras", validarToken, crearViaje);

router.put("/completarBitacoras/:id", validarToken, completarViaje);

router.delete("/bitacoras/:id", validarToken, eliminarViaje);

router.put("/bitacoras/:id", validarToken, editarViaje);

export default router;