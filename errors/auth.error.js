exports.AuthError = class extends Error {
    statusCode = 401;

    constructor(message) {
        super(message);
    }

    getResponse() {
        return {
            success: false,
            message: this.message
        }
    }
};