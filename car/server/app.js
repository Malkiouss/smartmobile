const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const ensureDB = require('./middleware/db');

dotenv.config();

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'AutoSmart Maroc API is running',
    databaseConfigured: Boolean(process.env.MONGODB_URI)
  });
};

apiRouter.get('/', healthHandler);
apiRouter.get('/health', healthHandler);

apiRouter.use(ensureDB);
apiRouter.use('/cars', require('./routes/cars'));
apiRouter.use('/auth', require('./routes/auth'));

app.use('/api', apiRouter);
app.use('/', apiRouter);

module.exports = app;
