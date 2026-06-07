import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dashboardRouter = Router();

// GET /api/dashboard/:userId — everything the home screen needs in one call
dashboardRouter.get('/:userId', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              assignments: {
                where: { dueDate: { gte: new Date() } },
                orderBy: { dueDate: 'asc' },
                take: 3,
              },
              announcements: {
                orderBy: { createdAt: 'desc' },
                take: 2,
                include: { user: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  const upcomingDeadlines = user.enrollments
    .flatMap((e) =>
      e.course.assignments.map((a) => ({
        ...a,
        courseCode: e.course.code,
        courseTitle: e.course.title,
      }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentAnnouncements = user.enrollments
    .flatMap((e) =>
      e.course.announcements.map((a) => ({
        ...a,
        courseCode: e.course.code,
        courseTitle: e.course.title,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      studentId: user.studentId,
      programme: user.programme,
      year: user.year,
      avatar: user.avatar,
    },
    enrolledCourses: user.enrollments.map((e) => ({
      courseId: e.courseId,
      code: e.course.code,
      title: e.course.title,
      instructor: e.course.instructor,
      credits: e.course.credits,
      progress: e.progress,
      grade: e.grade,
      schedule: e.course.schedule,
      room: e.course.room,
    })),
    upcomingDeadlines,
    recentAnnouncements,
  });
});
