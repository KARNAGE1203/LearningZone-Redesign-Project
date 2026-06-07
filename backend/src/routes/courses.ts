import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const courseRouter = Router();

courseRouter.get('/', async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { enrollments: true } } },
  });
  res.json(courses);
});

courseRouter.get('/:id', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      materials: { orderBy: { week: 'asc' } },
      assignments: { orderBy: { dueDate: 'asc' } },
      announcements: { orderBy: { createdAt: 'desc' }, include: { user: true } },
    },
  });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  return res.json(course);
});
