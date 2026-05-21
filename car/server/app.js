const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const ensureDB = require('./middleware/db');

dotenv.config();

const app = express();
const apiRouter = express.Router();
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');
const defaultAllowedOrigins = [
  'https://smartmobile-client.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');
const allowedOrigins = [
  ...defaultAllowedOrigins.map(normalizeOrigin),
  ...(process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .map(normalizeOrigin)
  .filter(Boolean)
];
const getAllowedOrigin = (origin) => {
  if (origin && allowedOrigins.includes(normalizeOrigin(origin))) {
    return normalizeOrigin(origin);
  }

  return allowedOrigins[0];
};
const setCorsHeaders = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(req.headers && req.headers.origin));
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
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

app.use('/uploads', express.static(uploadsDir));

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
