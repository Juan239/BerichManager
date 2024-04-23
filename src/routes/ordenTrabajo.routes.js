import { Router } from "express";
import {
  obtenerOrdenTrabajo,
  crearOrdenTrabajo,
  eliminarOrdenTrabajo,
} from "../controllers/ordenTrabajo.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"

const router = Router();

router.get("/ordenTrabajo", validarToken, obtenerOrdenTrabajo);

router.post("/ordenTrabajo", validarToken, crearOrdenTrabajo);

router.delete("/ordenTrabajo/:id", validarToken, eliminarOrdenTrabajo);

export default router;
