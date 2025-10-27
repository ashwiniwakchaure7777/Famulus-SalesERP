const validateRequest = (schema, property = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map(d => d.message),
    });
  }
  next();
};

module.exports = validateRequest; 