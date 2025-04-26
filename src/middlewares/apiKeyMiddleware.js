const response = require("../utils/response");

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];  // Mengambil API Key dari Headers
  if (apiKey && apiKey === process.env.API_KEY) {
    next(); // Lanjut ke endpoint berikutnya jika API Key benar
  } else {
    response(401, null, "Unauthorized", res);
  }
};

module.exports = verifyApiKey;
