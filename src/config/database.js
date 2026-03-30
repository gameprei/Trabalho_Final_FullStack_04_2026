import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import { Connection } from "mysql2";

// configurar dotenv
dotenv.config();
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// testar conexão
pool
    .getConnection()
    .then((connection) => {
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    })
    .catch((error) => {
        console.log("Erro ao conectar ao banco de dados", error);
    });

export default pool;