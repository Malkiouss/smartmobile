const connectDB = require('../config/db');

const ensureDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
};

module.exports = ensureDB;
