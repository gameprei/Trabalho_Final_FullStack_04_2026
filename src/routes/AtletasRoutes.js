import express from "express";
import AtletasController from "../controllers/AtletasController.js";

const router = express.Router();

// Rota para listar todos os atletas
router.get("/atletas", AtletasController.listar);
// Rota para buscar atletas por nome ou CPF
router.get("/atletas/:termo", AtletasController.buscar);
// Rota para cadastrar novos atletas
router.post("/atletas", AtletasController.cadastrar);
// Rota para excluir atleta
router.delete("/atletas/:id", AtletasController.deletar);
// Rota para editar atleta
router.patch("/atletas/:id", AtletasController.editar)

export default router;