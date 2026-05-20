const app = require('../car/server/app');

const normalizeVercelRequest = (req) => {
  const catchAllPath = req.query && req.query.path;

  if (Array.isArray(catchAllPath)) {
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = `/api/${catchAllPath.join('/')}${queryString}`;
    return;
  }

  if (typeof catchAllPath === 'string' && catchAllPath) {
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = `/api/${catchAllPath}${queryString}`;
    return;
  }

  if (req.url === '/' || req.url === '') {
    req.url = '/api';
  }
};

module.exports = (req, res) => {
  normalizeVercelRequest(req);
  return app(req, res);
};
