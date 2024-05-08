import { Router } from "express";
import { obtenerDestinos, crearDestino, eliminarDestino, obtenerDestinoPorId, actualizarDestino } from "../controllers/bitacoras/destinos.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/destinos", validarToken, obtenerDestinos);

router.post("/destinos", validarToken, crearDestino);

router.delete("/destinos/:id", validarToken, eliminarDestino);

router.get("/destinos/:id", validarToken, obtenerDestinoPorId);

router.put("/destinos/:id", validarToken, actualizarDestino);

export default router;