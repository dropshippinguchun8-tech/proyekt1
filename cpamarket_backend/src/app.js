const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const leadRoutes = require('./routes/leads');
const statsRoutes = require('./routes/stats');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CPAMaRKeT.Uz API', environment: config.nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
