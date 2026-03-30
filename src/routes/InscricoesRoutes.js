import express from "express";
import InscricoesController from "../controllers/InscricoesController.js";

const router = express.Router();

// Rota para listar todas as inscrições
router.get("/inscricoes", InscricoesController.listar);
// Rota para novas inscricoes
router.post("/inscricoes", InscricoesController.cadastrar);

export default router;
