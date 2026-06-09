import type { Notification } from '../types/notification';

// Dates relative to current session date: 2026-06-09
const now       = new Date(2026, 5, 9, 10, 30); // today
const yesterday = new Date(2026, 5, 8, 14, 0);  // yesterday
const june1     = new Date(2026, 5, 1, 9,  0);  // Mon 1 June
const may24a    = new Date(2026, 4, 24, 11, 0); // 24 May
const may24b    = new Date(2026, 4, 24, 15, 30);
const may22     = new Date(2026, 4, 22, 8,  0); // 22 May

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id:         '1',
    type:       'course',
    status:     'unread',
    title:      'Mock Exam Password Released',
    preview:    '!! Reminder!! Mock Exam password: test1234...',
    fullText:   '!! Reminder!! Dear Students, Mock Exam password: test1234. A mock exam has been created under Module Tools. Please attempt before the real exam on Friday.',
    source:     'OS & Networks',
    sourceType: 'course',
    timestamp:  '2 hours ago',
    createdAt:  now,
    actionUrl:  '/materials',
  },
  {
    id:         '2',
    type:       'university',
    status:     'unread',
    title:      'Block 4 Exam Schedule Released',
    preview:    'The examination timetable for Block 4 has been published...',
    fullText:   'The examination timetable for Block 4 has been published. Please review your assigned slots carefully and note any clashes immediately.',
    source:     'Dubai Campus',
    sourceType: 'university',
    timestamp:  'Mon, 1 June',
    createdAt:  june1,
    actionUrl:  '/notifications',
  },
  {
    id:         '3',
    type:       'deadline',
    status:     'unread',
    title:      'Phase Test 2 — Due Tomorrow',
    preview:    'Reminder: Phase Test 2 is scheduled for tomorrow at 14:00...',
    fullText:   'Reminder: Phase Test 2 for Operating Systems and Networks is scheduled for tomorrow at 14:00. Password will be released 30 minutes before the exam.',
    source:     'OS & Networks',
    sourceType: 'course',
    timestamp:  'Yesterday',
    createdAt:  yesterday,
    actionUrl:  '/assessments',
  },
  {
    id:         '4',
    type:       'grade',
    status:     'read',
    title:      'Phase Test 1 Results Available',
    preview:    'Your results for Phase Test 1 have been released. You scored 78/100.',
    fullText:   'Your results for Phase Test 1 have been released. You scored 78/100. Visit the Grades page to view detailed feedback and review your attempt.',
    source:     'OS & Networks',
    sourceType: 'course',
    timestamp:  '24 May',
    createdAt:  may24a,
    actionUrl:  '/grades',
  },
  {
    id:         '5',
    type:       'university',
    status:     'read',
    title:      'Professional Certifications Evidence Request',
    preview:    'Students are requested to submit evidence of professional certifications...',
    fullText:   'Students are requested to submit evidence of professional certifications, licenses, or micro-credentials via the student portal before June 30.',
    source:     'Student Services',
    sourceType: 'university',
    timestamp:  '24 May',
    createdAt:  may24b,
    actionUrl:  '/notifications',
  },
  {
    id:         '6',
    type:       'system',
    status:     'read',
    title:      'Campus Wi-Fi Maintenance',
    preview:    'Scheduled network maintenance this Saturday 2-6 AM...',
    fullText:   'Scheduled network maintenance this Saturday 2-6 AM. Portal and online resources may be temporarily unavailable. Plan your submissions accordingly.',
    source:     'IT Services',
    sourceType: 'admin',
    timestamp:  '22 May',
    createdAt:  may22,
    actionUrl:  '/notifications',
  },
];
