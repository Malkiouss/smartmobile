const app = require('../car/server/app');

const normalizeVercelRequest = (req, basePath = '') => {
  const catchAllPath = req.query && req.query.path;
  const pathParts = [];

  if (basePath) {
    pathParts.push(basePath);
  }

  if (Array.isArray(catchAllPath)) {
    pathParts.push(...catchAllPath);
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = `/api/${pathParts.join('/')}${queryString}`;
    return;
  }

  if (typeof catchAllPath === 'string' && catchAllPath) {
    pathParts.push(catchAllPath);
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = `/api/${pathParts.join('/')}${queryString}`;
    return;
  }

  if (basePath) {
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = `/api/${basePath}${queryString}`;
    return;
  }

  if (req.url === '/' || req.url === '') {
    req.url = '/api';
  }
};

const createHandler = (basePath = '') => {
  return (req, res) => {
    normalizeVercelRequest(req, basePath);
    return app(req, res);
  };
};

module.exports = createHandler();
module.exports.createHandler = createHandler;
