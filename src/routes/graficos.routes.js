import { Router } from "express";
import { ordenesPorEstablecimiento, ordenesTrabajoTotal } from "../controllers/graficos.controller.js";

const router = Router()

router.get("/graficos/:mes", ordenesPorEstablecimiento)
router.get("/ordenesTotales", ordenesTrabajoTotal)

export default router