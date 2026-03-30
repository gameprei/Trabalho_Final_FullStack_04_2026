import InscricaoModel from "../models/InscricoesModel.js";

class InscricoesController {

    static async cadastrar(req, res, next) {
        try {

            const {
                atleta_id,
                modalidade_id
            } = req.body;

            const inscricao = await InscricaoModel.cadastrar(atleta_id, modalidade_id);
            return res.status(201).json(inscricao)
        } catch(error){
            next(error);
        };
    }

    static async listar(req, res, next) {
        try{
            const inscricoes = await InscricaoModel.listar();
            return res.status(200).json(inscricoes);
        } catch (error) {
            next(error)
        };
    }
}

export default InscricoesController;