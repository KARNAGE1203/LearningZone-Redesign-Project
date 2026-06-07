/**
 * Production seed — plain JavaScript so `node prisma/seed.js` works without
 * ts-node.  Keep this in sync with seed.ts (used for local dev).
 */

'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt           = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const SALT = 10;
  const [hash1, hash2] = await Promise.all([
    bcrypt.hash('IamStudent123', SALT),
    bcrypt.hash('IamStudent123', SALT),
  ]);

  const student = await prisma.user.upsert({
    where:  { studentId: 'P2936821' },
    update: { password: hash1 },
    create: {
      studentId:  'P2936821',
      email:      'p2936821@dmu.ac.uk',
      name:       'Danish Saini',
      programme:  'BSc Computer Science',
      year:       2,
      password:   hash1,
    },
  });

  await prisma.user.upsert({
    where:  { studentId: 'P2410001' },
    update: { password: hash2 },
    create: {
      studentId:  'P2410001',
      email:      'p2410001@dmu.ac.uk',
      name:       'Alex Johnson',
      programme:  'BSc Software Engineering',
      year:       1,
      password:   hash2,
    },
  });

  const courses = await Promise.all([
    prisma.course.upsert({
      where:  { code: 'CTEC2901' },
      update: {},
      create: {
        code:        'CTEC2901',
        title:       'Software Engineering',
        description: 'Principles and practices of software engineering including agile, testing, and design patterns.',
        credits:     20,
        semester:    'Semester 1',
        department:  'Computing',
        instructor:  'Dr. Ahmed Hassan',
        room:        'Gateway House 2.01',
        schedule:    'Mon 10:00–12:00, Thu 14:00–15:00',
      },
    }),
    prisma.course.upsert({
      where:  { code: 'CTEC2602' },
      update: {},
      create: {
        code:        'CTEC2602',
        title:       'Web Technologies',
        description: 'Modern web development covering HTML, CSS, JavaScript, React, and REST APIs.',
        credits:     20,
        semester:    'Semester 1',
        department:  'Computing',
        instructor:  'Dr. Sara Malik',
        room:        'Hugh Aston 2.32',
        schedule:    'Tue 09:00–11:00, Fri 13:00–14:00',
      },
    }),
    prisma.course.upsert({
      where:  { code: 'CTEC2701' },
      update: {},
      create: {
        code:        'CTEC2701',
        title:       'Database Systems',
        description: 'Relational database design, SQL, normalisation, and introduction to NoSQL.',
        credits:     20,
        semester:    'Semester 1',
        department:  'Computing',
        instructor:  'Prof. Khalid Ramadan',
        room:        'Gateway House 1.06',
        schedule:    'Wed 11:00–13:00, Fri 10:00–11:00',
      },
    }),
    prisma.course.upsert({
      where:  { code: 'MATH2201' },
      update: {},
      create: {
        code:        'MATH2201',
        title:       'Discrete Mathematics',
        description: 'Logic, sets, graphs, combinatorics, and algorithms for computing.',
        credits:     20,
        semester:    'Semester 1',
        department:  'Mathematics',
        instructor:  'Dr. Layla Nour',
        room:        'Vijay Patel 3.10',
        schedule:    'Mon 13:00–15:00, Thu 10:00–11:00',
      },
    }),
  ]);

  const grades = ['B+', null, 'B', null];
  await Promise.all(
    courses.map((course, i) =>
      prisma.enrollment.upsert({
        where:  { userId_courseId: { userId: student.id, courseId: course.id } },
        update: {},
        create: {
          userId:   student.id,
          courseId: course.id,
          progress: [65, 78, 52, 40][i],
          ...(grades[i] != null ? { grade: grades[i] } : {}),
        },
      })
    )
  );

  const now    = new Date();
  const inDays = (d) => new Date(now.getTime() + d * 86_400_000);

  await Promise.all([
    prisma.assignment.upsert({
      where:  { id: 'assign-1' },
      update: {},
      create: {
        id:          'assign-1',
        courseId:    courses[0].id,
        title:       'Agile Sprint Retrospective Report',
        description: 'Write a 1500-word reflection on your team sprint.',
        dueDate:     inDays(3),
        maxMarks:    100,
        type:        'Report',
      },
    }),
    prisma.assignment.upsert({
      where:  { id: 'assign-2' },
      update: {},
      create: {
        id:          'assign-2',
        courseId:    courses[1].id,
        title:       'React Portfolio App',
        description: 'Build a personal portfolio using React and deploy it.',
        dueDate:     inDays(7),
        maxMarks:    100,
        type:        'Project',
      },
    }),
    prisma.assignment.upsert({
      where:  { id: 'assign-3' },
      update: {},
      create: {
        id:          'assign-3',
        courseId:    courses[2].id,
        title:       'ER Diagram & Normalisation',
        description: 'Design an ER diagram and normalise to 3NF for the given case study.',
        dueDate:     inDays(10),
        maxMarks:    50,
        type:        'Coursework',
      },
    }),
  ]);

  await Promise.all([
    prisma.announcement.upsert({
      where:  { id: 'ann-1' },
      update: {},
      create: {
        id:       'ann-1',
        userId:   student.id,
        courseId: courses[0].id,
        title:    'Lab session moved to Friday',
        body:     "This week's lab has been moved to Friday 14:00 in GH 2.01 due to a scheduling conflict.",
        pinned:   true,
      },
    }),
    prisma.announcement.upsert({
      where:  { id: 'ann-2' },
      update: {},
      create: {
        id:       'ann-2',
        userId:   student.id,
        courseId: courses[1].id,
        title:    'Guest Lecture — Senior Engineer at Careem',
        body:     'We have a guest speaker from Careem joining us next Tuesday. Attendance is strongly recommended.',
        pinned:   false,
      },
    }),
  ]);

  console.log('✅  Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
