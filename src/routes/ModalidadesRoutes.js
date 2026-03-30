import express from "express";
import ModalidadesController from "../controllers/ModalidadesController.js";

const router = express.Router();

// Rota para listar todas as modalidades
router.get("/modalidades", ModalidadesController.listar);
// Rota para cadastrar novas modalidades
router.post("/modalidades", ModalidadesController.cadastrar);

export default router;