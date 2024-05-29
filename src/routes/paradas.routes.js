import { Router } from "express";

import {obtenerParadaDeViaje, obtenerParadas, crearParada, editarParada, eliminarParada, obtenerParadaPorId} from "../controllers/bitacoras/paradas.controller.js";

const router = Router();

router.get("/paradas", obtenerParadas);
router.get("/paradas/:id", obtenerParadaDeViaje);
router.post("/paradas", crearParada);
router.put("/paradas/:id", editarParada);
router.delete("/paradas/:id", eliminarParada);
router.get("/parada/:id", obtenerParadaPorId);


export default router;