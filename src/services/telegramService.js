const axios = require("axios");

const sendTelegramAlert = async (message) => {
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    await axios.post(telegramApiUrl, { chat_id: chatId, text: message });
    console.log("Telegram alert sent successfully");
  } catch (error) {
    console.error("Error sending Telegram alert:", error);
  }
};

module.exports = sendTelegramAlert;
