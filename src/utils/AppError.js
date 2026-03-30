// utils/AppError.js Classe de erro padrão
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default AppError;