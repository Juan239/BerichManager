import { Router } from "express";
import { generarPDF } from "../controllers/pdf.controller.js";

const router = Router();

router.get("/pdf/:id", generarPDF)

export default router