const errorHandler = (error, req, res, next) => {
  console.log(error);
  let statusCode = error.status || 500;
  let errorMessage = error.message || "Internal server Error";
  res.status(statusCode).send({
    message: errorMessage,
    stack: error.stack,
    name: error.name,
    status: error.status,
  });
};

export default errorHandler;
