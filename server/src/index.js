import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) || '*'
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/todos', todoRoutes);

// generic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
