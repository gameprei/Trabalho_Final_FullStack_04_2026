import pool from "../config/database.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

class ModalidadeModel{

    static ValidarCamposObrigatorios(modalidade){
        const {mod_nome, mod_categoria, mod_vagas} = modalidade;

        if(!mod_nome || mod_categoria || mod_vagas){
            throw new AppError("Campos obrigatórios ausentes", 400);
        }
    }

    static async ValidarNomeDuplicado(nome){
        const [rows] = await pool.query(`
            SELECT id FROM modalidades WHERE mod_nome = ?`,
        [nome]
        );

        if(rows.length > 0 ){
            throw new AppError("Já existe uma modalidade com este nome", 409);
        }
    }

    static ValidarVagas(vagas){
        if (vagas <= 0 ){
            throw new AppError("Número de vagas inválido", 400);
        }
    }

    static validarCategoria(categoria) {
        const categoriasValidas = ["Amador", "Semi-Profissional", "Profissional"];
        if (!categoriasValidas.includes(categoria)) {
            throw new AppError("Categoria inválida", 400);
        }
    }

    static validarFaixaEtaria(faixa) {
        if (faixa == null) return;

        const faixasValidas = ["Sub-15", "Sub-17", "Sub-20", "Adulto", "Master"];
        if (!faixasValidas.includes(faixa)) {
            throw new AppError("Faixa etária inválida", 400);
        }
    }

    static async cadastrar(modalidade) {
        if (!modalidade || Object.keys(modalidade).length === 0) {
            throw new AppError("Dados da modalidade não informados", 400);
        }

        const {
            mod_nome,
            mod_categoria,
            mod_faixa_etaria,
            mod_vagas,
            mod_descricao,
        } = modalidade;

        this.ValidarCamposObrigatorios(modalidade);
        this.validarCategoria(mod_categoria);
        this.validarFaixaEtaria(mod_faixa_etaria);
        this.ValidarVagas(mod_vagas);
        await this.ValidarNomeDuplicado(mod_nome);

        const [result] = await pool.query(`
            INSERT INTO modalidades (
            mod_nome, mod_categoria, mod_faixa_etaria, 
            mod_vagas, mod_descricao
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                mod_nome,
                mod_categoria,
                mod_faixa_etaria,
                mod_vagas,
                mod_descricao
            ]
        );

        return ApiResponse.success(
            {
                id: result.insertId,
                mod_nome
            },
            "Modalidade cadastrada com sucesso"
        );
    }

    static async listar() {
        const [rows] = await pool.query(`
            SELECT * FROM modalidades ORDER BY mod_nome`
        );
        return ApiResponse.success(rows, "Modalidade(s) encontrada(s)")
    }
}   

export default ModalidadeModel