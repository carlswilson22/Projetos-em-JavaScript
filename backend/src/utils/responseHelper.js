const success = (res, data, statusCode = 200) => {
    return res.status(statusCode).json(data);
};

const error = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ error: message });
};

module.exports = { success, error };
