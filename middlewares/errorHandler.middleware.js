module.exports = (error, req, res, next) => {
    let errorResponse = {};
    let statusCode = 500;

    if (!error.getResponse) {
        errorResponse = {
            success: false,
            message: error.message
        }
    } else {
        errorResponse = error.getResponse();
    }

    if (error.statusCode) {
        statusCode = error.statusCode;
    }

    if (error.data) {
        errorResponse.data = error.data;
    }

    return res.status(statusCode).json(errorResponse);
}