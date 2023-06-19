exports.ValidationError = class extends Error {
    statusCode = 422;

    constructor(message) {
        super(message);
    }

    getResponse () {
        return {
            success: false,
            message: this.message
        }
    }
};