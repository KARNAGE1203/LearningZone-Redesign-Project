import type { ElementType } from 'react';
import { Database, Cpu, Code2, Server } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssessmentRecord {
  title:  string;
  weight: string;
  grade:  string;
}

export interface CourseRecord {
  block:        number;
  course:       string;
  code:         string;
  grade:        string;
  status:       'done' | 'active';
  abbr:         string;
  color:        string;
  accentBg:     string;
  icon:         ElementType;
  professor?:   string;
  schedule?:    string;
  description?: string;
  assessments?: AssessmentRecord[];
}

// ─── Academic year timeline ────────────────────────────────────────────────────
// Shared course data for the Home page timeline cards and the read-only
// course archive (CourseSummary) pages for completed blocks.

export const TIMELINE: CourseRecord[] = [
  {
    block: 1, course: 'Database Design', code: 'CTEC1401_2025_601', grade: '68%',
    status: 'done', abbr: 'DB', color: '#0369a1', accentBg: '#e0f2fe', icon: Database,
    professor: 'Dr. Aisha Rahman', schedule: 'Tue/Thu 1:00 PM',
    description: 'An introduction to relational database theory and practice, covering ER modelling, normalisation, SQL querying, and transaction management through hands-on lab work.',
    assessments: [
      { title: 'SAP',          weight: '10%', grade: '65%' },
      { title: 'Phase Test 1', weight: '30%', grade: '70%' },
      { title: 'Phase Test 2', weight: '30%', grade: '64%' },
      { title: 'Phase Test 3', weight: '30%', grade: '70%' },
    ],
  },
  {
    block: 2, course: 'Fundamental CS', code: 'CTEC1501_2025_602', grade: '74%',
    status: 'done', abbr: 'CS', color: '#7c3aed', accentBg: '#ede9fe', icon: Cpu,
    professor: 'Dr. James Whitfield', schedule: 'Mon/Wed 11:00 AM',
    description: 'Core computer science foundations including algorithms, data structures, computational thinking, and an introduction to discrete mathematics for computing.',
    assessments: [
      { title: 'SAP',          weight: '10%', grade: '72%' },
      { title: 'Phase Test 1', weight: '30%', grade: '78%' },
      { title: 'Phase Test 2', weight: '30%', grade: '70%' },
      { title: 'Phase Test 3', weight: '30%', grade: '76%' },
    ],
  },
  {
    block: 3, course: 'Computer Programming', code: 'CTEC1601_2025_603', grade: '81%',
    status: 'done', abbr: 'CP', color: '#059669', accentBg: '#d1fae5', icon: Code2,
    professor: 'Prof. Elena Castillo', schedule: 'Mon/Wed/Fri 9:00 AM',
    description: 'A practical introduction to programming using Python and Java, covering control structures, object-oriented design, debugging, and unit testing.',
    assessments: [
      { title: 'SAP',          weight: '10%', grade: '80%' },
      { title: 'Phase Test 1', weight: '30%', grade: '85%' },
      { title: 'Phase Test 2', weight: '30%', grade: '78%' },
      { title: 'Phase Test 3', weight: '30%', grade: '82%' },
    ],
  },
  {
    block: 4, course: 'OS & Networks', code: 'CTEC1704D_2025_604', grade: '67%',
    status: 'active', abbr: 'OS', color: '#0d8a7a', accentBg: '#ccfbf1', icon: Server,
    professor: 'Prof. Muhammad Al-Ibaisi', schedule: 'MWF 10:00 AM',
  },
];
