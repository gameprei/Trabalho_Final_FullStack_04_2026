import pool from "../config/database.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

class InscricaoModel {

    static async validarInscricao(connection, atleta_id, modalidade_id) {
        
        //  Buscar atleta
        const [atletaRows] = await connection.execute(
            "SELECT faixa_etaria, categoria FROM atletas WHERE id = ?",
            [atleta_id]
        );

        if (atletaRows.length === 0) {
            throw new AppError("Atleta não encontrado", 404);
        }

        const atleta = atletaRows[0];

        // Buscar modalidade
        const [modalidadeRows] = await connection.execute(
            "SELECT mod_faixa_etaria, mod_categoria, mod_vagas FROM modalidades WHERE mod_id = ?",
            [modalidade_id]
        );

        if (modalidadeRows.length === 0) {
            throw new AppError("Modalidade não encontrada", 404);
        }

        const modalidade = modalidadeRows[0];

        if (atleta.faixa_etaria !== modalidade.mod_faixa_etaria) {
            throw new AppError("Faixa etária incompatível", 400);
        }

        if (atleta.categoria !== modalidade.mod_categoria) {
            throw new AppError("Categoria incompatível", 400);
        }

        if (modalidade.mod_vagas <= 0) {
            throw new AppError("Não há vagas disponíveis", 400);
        }
    }

    static async cadastrar( atleta_id, modalidade_id ) {

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await this.validarInscricao(connection, atleta_id, modalidade_id);

            //  Inserir inscrição
            const [result] = await connection.execute(
                "INSERT INTO inscricoes (atleta_id, modalidade_id) VALUES (?, ?)",
                [atleta_id, modalidade_id]
            );

            await connection.commit();

            return {
                id: result.insertId,
                atleta_id,
                modalidade_id
            };

        } catch (error) {
            await connection.rollback();

            //  Repassa erro já tratado
            if (error instanceof AppError) {
                throw error;
            }

            //  Trata erros do MySQL
            if (error.code === "ER_DUP_ENTRY") {
                throw new AppError("Atleta já inscrito nesta modalidade", 400);
            }

            if (error.code === "ER_SIGNAL_EXCEPTION") {
                throw new AppError(error.sqlMessage, 400);
            }

            throw new AppError("Erro ao registrar inscrição", 500);

        } finally {
            connection.release();
        }
    }

    static async listar() {
        const [rows] = await pool.query(`
            SELECT
                i.ins_id,
                i.ins_data,
                i.atleta_id,
                i.modalidade_id,
                a.nome_completo AS atleta_nome,
                m.mod_nome AS modalidade_nome,
                m.mod_categoria AS modalidade_categoria,
                m.mod_faixa_etaria AS modalidade_faixa_etaria
            FROM inscricoes i
            JOIN atletas a ON a.id = i.atleta_id
            JOIN modalidades m ON m.mod_id = i.modalidade_id
            ORDER BY i.ins_data`
        );
        return ApiResponse.success(rows, "Inscrição(ões) encontrada(s)")
    }
}

export default InscricaoModel;