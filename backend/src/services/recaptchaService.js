const axios = require("axios");

const verifyRecaptcha = async (token) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                secret: secretKey,
                response: token
                },
                timeout: 10000 
            }
            );
        return response.data.success;
    } catch (error) {
            return false;
        }
};

module.exports = { verifyRecaptcha };