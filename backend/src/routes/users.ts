import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const userRouter = Router();

userRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      enrollments: { include: { course: true } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

userRouter.get('/by-student-id/:studentId', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { studentId: req.params.studentId },
    include: {
      enrollments: { include: { course: true } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});
