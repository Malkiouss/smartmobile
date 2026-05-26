const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const ensureDB = require('./middleware/db');

dotenv.config();

const app = express();
const apiRouter = express.Router();
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
const corsOptions = {
  origin(origin, callback) {
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use((req, res, next) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
});
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'AutoSmart Maroc API is running',
    databaseConfigured: Boolean(process.env.MONGODB_URI)
  });
};

apiRouter.get('/', healthHandler);
apiRouter.get('/health', healthHandler);
apiRouter.get('/health/db', ensureDB, (req, res) => {
  res.json({
    status: 'ok',
    message: 'Database connection is working'
  });
});

apiRouter.use(ensureDB);
apiRouter.use('/cars', require('./routes/cars'));
apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/admin', require('./routes/admin'));

app.use('/api/admin', ensureDB, require('./routes/admin'));
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found',
    method: req.method,
    path: req.originalUrl
  });
});

module.exports = app;
