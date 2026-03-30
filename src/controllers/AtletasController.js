import AtletasModel from "../models/AtletasModel.js";

class AtletasController {

    //  Cadastrar atleta
    static async cadastrar(req, res, next) {
        try {
            const atleta = await AtletasModel.cadastrar(req.body);
            return res.status(201).json(atleta);
        } catch (error) {
            next(error);
        }
    }

    //  Listar atletas
    static async listar(req, res, next) {
        try {
            const atletas = await AtletasModel.listar();
            return res.status(200).json(atletas);
        } catch (error) {
            next(error);
        }
    }

    
    static async buscar(req, res, next) {
        try {
            const { filtro } = req.query;

            const atletas = await AtletasModel.buscar(filtro);
            return res.status(200).json(atletas);
        } catch (error) {
            next(error);
        }
    }

    static async deletar(req, res, next) {
        try {
            const { id } = req.params;

            const resultado = await AtletasModel.deletar(id);
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    static async editar(req, res, next){
        try{
            const { id } = req.params;
            const atleta = req.body;

            const resultado = await AtletasModel.editar(id, atleta);
            return res.status(200).json(resultado);
        }catch(error){
            next(error);
        }
    }
}


export default AtletasController;