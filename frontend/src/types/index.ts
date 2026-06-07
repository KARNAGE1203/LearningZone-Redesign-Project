export interface UserSummary {
  id: string;
  name: string;
  studentId: string;
  programme: string;
  year: number;
  avatar: string | null;
}

export interface EnrolledCourse {
  courseId: string;
  code: string;
  title: string;
  instructor: string;
  credits: number;
  progress: number;
  grade: string | null;
  schedule: string | null;
  room: string | null;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  maxMarks: number;
  courseCode: string;
  courseTitle: string;
}

export interface RecentAnnouncement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  courseCode: string;
  courseTitle: string;
  user: { name: string };
}

export interface DashboardData {
  user: UserSummary;
  enrolledCourses: EnrolledCourse[];
  upcomingDeadlines: UpcomingDeadline[];
  recentAnnouncements: RecentAnnouncement[];
}
