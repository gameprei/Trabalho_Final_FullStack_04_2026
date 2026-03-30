class ApiResponse {
    static success(data, message = "Operação realizada com sucesso") {
        return {
            status: "success",
            message,
            data
        };
    }
}

export default ApiResponse;