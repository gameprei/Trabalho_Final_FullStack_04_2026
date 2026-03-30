import pool from "../config/database.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

class AtletaModel {


    static validarDadosObrigatorios(atleta) {
        const { nome_completo, data_nascimento, cpf, categoria, faixa_etaria } = atleta;

        if (!nome_completo || !data_nascimento || !cpf || !categoria || !faixa_etaria) {
            throw new AppError("Campos obrigatórios ausentes", 400);
        }
    }

    static validarCPF(cpf) {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            throw new AppError("CPF inválido", 400);
        }
    }

    static validarCategoria(categoria) {
        const categoriasValidas = ["Amador", "Semi-Profissional", "Profissional"];
        if (!categoriasValidas.includes(categoria)) {
            throw new AppError("Categoria inválida", 400);
        }
    }

    static validarFaixaEtaria(faixa) {
        const faixasValidas = ["Sub-15", "Sub-17", "Sub-20", "Adulto", "Master"];
        if (!faixasValidas.includes(faixa)) {
            throw new AppError("Faixa etária inválida", 400);
        }
    }

    static validarEmail(email) {
        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError("Email inválido", 400);
        }
    }

    static validarMedidas(peso, altura) {
        if (peso && peso <= 0) throw new AppError("Peso inválido", 400);
        if (altura && altura <= 0) throw new AppError("Altura inválida", 400);
    }

    static async validarCpfDuplicado(cpf) {
        const [rows] = await pool.query(
            `SELECT id FROM atletas WHERE cpf = ?`,
            [cpf]
        );

        if (rows.length > 0) {
            throw new AppError("Já existe atleta com este CPF", 409);
        }
    }

    static validarBusca(filtro) {
        if (!filtro) {
            throw new AppError("Informe nome ou CPF para busca", 400);
        }
    }

    static validarId(id) {
        if (!id) {
            throw new AppError("ID não informado", 400);
        }
    }

    static async cadastrar(atleta) {

        if (!atleta || Object.keys(atleta).length === 0) {
            throw new AppError("Dados do atleta não informados", 400);
        }

        const {
            nome_completo,
            data_nascimento,
            cpf,
            rg,
            orgao_emissor,
            endereco,
            bairro,
            municipio,
            cep,
            uf,
            telefone,
            celular,
            email,
            clube_equipe,
            peso,
            altura,
            restricao_medica,
            contato_emergencia_nome,
            contato_emergencia_telefone,
            categoria,
            faixa_etaria
        } = atleta;

        this.validarDadosObrigatorios(atleta);
        this.validarCPF(cpf);
        this.validarCategoria(categoria);
        this.validarFaixaEtaria(faixa_etaria);
        this.validarEmail(email);
        this.validarMedidas(peso, altura);
        await this.validarCpfDuplicado(cpf);


        const [result] = await pool.query(
            `INSERT INTO atletas (
                nome_completo, data_nascimento, cpf, rg, orgao_emissor,
                endereco, bairro, municipio, cep, uf,
                telefone, celular, email, clube_equipe,
                peso, altura, restricao_medica,
                contato_emergencia_nome, contato_emergencia_telefone,
                categoria, faixa_etaria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome_completo, data_nascimento, cpf, rg, orgao_emissor,
                endereco, bairro, municipio, cep, uf,
                telefone, celular, email, clube_equipe,
                peso, altura, restricao_medica,
                contato_emergencia_nome, contato_emergencia_telefone,
                categoria, faixa_etaria
            ]
        );

        return ApiResponse.success(
            {
                id: result.insertId,
                nome_completo,
                cpf,
                categoria,
                faixa_etaria
            },
            "Atleta cadastrado com sucesso"
        );
    }

    static async listar() {
        const [rows] = await pool.query(
            `SELECT * FROM atletas ORDER BY nome_completo`
        );
        return ApiResponse.success(rows, "Atleta(s) encontrado(s)");
    }

    static async buscar(filtro) {

        this.validarBusca(filtro);

        const [rows] = await pool.query(
            `SELECT * FROM atletas 
             WHERE nome_completo LIKE ? OR cpf = ?`,
            [`%${filtro}%`, filtro]
        );

        if (rows.length === 0) {
            throw new AppError("Nenhum atleta encontrado", 404);
        }

        return ApiResponse.success(rows, "Lista de atletas");
    }

    static async deletar(id) {

        this.validarId(id);

        const [result] = await pool.query(
            `DELETE FROM atletas WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            throw new AppError("Atleta não encontrado", 404);
        }

        return ApiResponse.success(null, "Atleta excluído com sucesso");
    }

    static async editar(id, atleta){

        this.validarId(id);

        if (!atleta || Object.keys(atleta).length === 0) {
            throw new AppError("Dados do atleta não informados", 400);
        }

        const {
            endereco,
            bairro,
            municipio,
            cep,
            uf,
            telefone,
            celular,
            email,
            clube_equipe,
            peso,
            altura,
            restricao_medica,
            contato_emergencia_nome,
            contato_emergencia_telefone,
            categoria,
            faixa_etaria
        } = atleta;

        if (categoria !== undefined) this.validarCategoria(categoria);
        if (faixa_etaria !== undefined) this.validarFaixaEtaria(faixa_etaria);
        this.validarEmail(email);
        this.validarMedidas(peso, altura);


        const [result] = await pool.query(
            `UPDATE atletas SET ? WHERE id =?`,
            [atleta, id]
        );

        if (result.affectedRows === 0){
            throw new AppError("Atleta não encontrado", 404);
        }

        const [rows] = await pool.query(
            `SELECT * FROM atletas WHERE id = ?`,
            [id]
        );

        return ApiResponse.success(rows[0], "Atualizado com sucesso");
    };
}

export default AtletaModel;