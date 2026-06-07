import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const authRouter = Router();

const STUDENT_ID_REGEX = /^P\d{7}$/;

authRouter.post('/login', async (req: Request, res: Response) => {
  const { studentId, password } = req.body as { studentId?: string; password?: string };

  if (!studentId || !password) {
    return res.status(400).json({ error: 'Student ID and password are required.' });
  }

  if (!STUDENT_ID_REGEX.test(studentId)) {
    return res.status(400).json({ error: 'Student ID must be in the format PXXXXXXX.' });
  }

  const user = await prisma.user.findUnique({ where: { studentId } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid student ID or password.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid student ID or password.' });
  }

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ userId: user.id, studentId: user.studentId }, secret, { expiresIn: '7d' });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      studentId: user.studentId,
      programme: user.programme,
      year: user.year,
      avatar: user.avatar,
    },
  });
});
