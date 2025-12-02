require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Frontend task API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);

// Generic error handler to avoid leaking stack traces
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  if (process.env.NODE_ENV !== 'test') {
    console.error('API Error:', err);
  }
  res.status(status).json({ message });
});

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });
