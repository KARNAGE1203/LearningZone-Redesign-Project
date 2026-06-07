import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import { courseRouter } from './routes/courses';
import { dashboardRouter } from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Accept a comma-separated list of allowed origins so both localhost and
// the production Netlify URL can be set in one FRONTEND_URL env var.
const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server requests (no origin) and listed origins.
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error(`CORS: ${origin} not permitted`));
    },
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Learning Zone API running on http://localhost:${PORT}`);
});
