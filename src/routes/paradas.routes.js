import { Router } from "express";

import {obtenerParada, obtenerParadas, crearParada, editarParada, eliminarParada} from "../controllers/bitacoras/paradas.controller.js";

const router = Router();

router.get("/paradas", obtenerParadas);
router.get("/paradas/:id", obtenerParada);
router.post("/paradas", crearParada);
router.put("/paradas/:id", editarParada);
router.delete("/paradas/:id", eliminarParada);

export default router;