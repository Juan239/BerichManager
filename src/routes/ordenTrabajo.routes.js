import { Router } from "express";
import {
  obtenerOrdenTrabajo,
  crearOrdenTrabajo,
  eliminarOrdenTrabajo,
  actualizarOrdentrabajo,
  obtenerOrdenPorId
} from "../controllers/ordenesTrabajo/ordenTrabajo.controller.js";
import {validarToken} from "../middleware/verificarToken.middleware.js"

const router = Router();

router.get("/ordenTrabajo", validarToken, obtenerOrdenTrabajo);

router.get("/ordenTrabajo/:id", validarToken, obtenerOrdenPorId);

router.post("/ordenTrabajo", validarToken, crearOrdenTrabajo);

router.delete("/ordenTrabajo/:id", validarToken, eliminarOrdenTrabajo);

router.put("/ordenTrabajo/:id", validarToken, actualizarOrdentrabajo);

export default router;
