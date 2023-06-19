exports.NotFoundError = class extends Error {
    statusCode = 404;

    constructor(message) {
        super(message);
    }

    getResponse() {
        return {
            success: false,
            message: this.message
        }
    }
}