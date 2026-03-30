import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { error } from 'node:console';

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Importar rotas
app.use("/api", (await import("./routes/AtletasRoutes.js")).default);
app.use("/api", (await import("./routes/ModalidadesRoutes.js")).default);
app.use("/api", (await import("./routes/InscricoesRoutes.js")).default);

app.get("/", (req, res) =>{
    res.json({message : "API rodando!"});
});

app.use((req, res) => {
    res.status(404).json({message: "Endpoint não encontrado"});
});

app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: err.message
    });
});

export default app;