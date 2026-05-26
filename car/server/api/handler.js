const app = require('../app');

const defaultAllowedOrigins = [
  'https://smartmobile-client.vercel.app',
  'https://www.autosmartmaroc.com',
  'https://autosmartmaroc.com',
  'https://autosmart.github.io',
  'https://autosmartmaroc.ma',
  'https://www.autosmartmaroc.ma',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');
const allowedOrigins = [
  ...defaultAllowedOrigins.map(normalizeOrigin),
  ...[
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL
  ]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map((origin) => origin.trim())
    .map(normalizeOrigin)
    .filter(Boolean)
].filter((origin, index, origins) => origins.indexOf(origin) === index);

const getAllowedOrigin = (origin) => {
  if (!origin) return null;
  return normalizeOrigin(origin);
};

const setCorsHeaders = (req, res) => {
  const allowedOrigin = getAllowedOrigin(req.headers && req.headers.origin);

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

const getQueryString = (url = '') => {
  const queryIndex = url.indexOf('?');
  return queryIndex >= 0 ? url.slice(queryIndex) : '';
};

const cleanPathPart = (part) => String(part || '').replace(/^\/+|\/+$/g, '');

const normalizeVercelRequest = (req, basePath = '') => {
  const catchAllPath = req.query && req.query.path;
  const queryString = getQueryString(req.url);
  const originalPath = (req.url || '').split('?')[0] || '/';

  if (originalPath.startsWith('/api')) {
    return;
  }

  const pathParts = [];
  const cleanBasePath = cleanPathPart(basePath);

  if (cleanBasePath) {
    pathParts.push(cleanBasePath);
  }

  if (Array.isArray(catchAllPath)) {
    pathParts.push(...catchAllPath.map(cleanPathPart).filter(Boolean));
  } else if (typeof catchAllPath === 'string' && catchAllPath) {
    pathParts.push(cleanPathPart(catchAllPath));
  } else {
    const fallbackPath = cleanPathPart(originalPath);
    if (fallbackPath && fallbackPath !== cleanBasePath) {
      pathParts.push(fallbackPath);
    }
  }

  req.url = `/api${pathParts.length ? `/${pathParts.join('/')}` : ''}${queryString}`;
};

const createHandler = (basePath = '') => {
  return (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    normalizeVercelRequest(req, basePath);
    return app(req, res);
  };
};

module.exports = createHandler();
module.exports.createHandler = createHandler;
