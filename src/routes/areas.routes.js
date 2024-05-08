import { Router } from "express";
import { obtenerAreas, crearAreas, eliminarArea, obtenerAreaPorId, actualizarArea } from "../controllers/usuarios/areas.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/areas", validarToken, obtenerAreas);
router.post("/areas", validarToken, crearAreas);
router.delete("/areas/:id", validarToken, eliminarArea);
router.get("/areas/:id", validarToken, obtenerAreaPorId);
router.put("/areas/:id", validarToken, actualizarArea);

export default router;