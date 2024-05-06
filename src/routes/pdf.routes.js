import { Router } from "express";
import { generarPDFordenTrabajo, generarPDFbajaEquipos } from "../controllers/pdf.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/pdf/ordenTrabajo/:id",validarToken,generarPDFordenTrabajo)

router.get("/pdf/bajaEquipos/:id",validarToken,generarPDFbajaEquipos)
export default router