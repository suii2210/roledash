const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (err) {
    const first = err.errors?.[0];
    const message = first?.message || 'Invalid request';
    res.status(400).json({ message });
  }
};

module.exports = validate;

