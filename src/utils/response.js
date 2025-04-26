const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
      status: statusCode === 200 ? "success" : "error",
      message,
      data,
      metadata: {
        prev: "",
        next: "",
        current: "",
      },
    });
  };
  
  module.exports = response;
  