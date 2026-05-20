const app = require('../app');

const normalizeVercelRequest = (req) => {
  const catchAllPath = req.query && req.query.path;
  const pathParts = Array.isArray(catchAllPath)
    ? catchAllPath
    : catchAllPath
      ? [catchAllPath]
      : [];

  const queryIndex = req.url.indexOf('?');
  const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
  const normalizedPath = pathParts.length > 0 ? `/api/${pathParts.join('/')}` : '/api';

  req.url = `${normalizedPath}${queryString}`;
};

module.exports = (req, res) => {
  normalizeVercelRequest(req);
  return app(req, res);
};
