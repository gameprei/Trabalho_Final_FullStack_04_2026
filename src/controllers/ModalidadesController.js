import ModalidadeModel from "../models/ModalidadesModel.js";

class ModalidadesController{

    static async cadastrar(req, res, next) {
        try {
            const modalidade = await ModalidadeModel.cadastrar(req.body);
            return res.status(201).json(modalidade);
        } catch(error) {
            next(error);
        };
    }

    static async listar(req, res, next) {
        try {
            const modalidades = await ModalidadeModel.listar();
            return res.status(200).json(modalidades);
        } catch (error){
            next(error);
        };
    }
}

export default ModalidadesController;