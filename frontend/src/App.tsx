import { useState } from 'react';
import Login from './pages/Login';
import MyCourses from './pages/MyCourses';
import Home from './pages/Home';
import CourseMaterials from './pages/CourseMaterials';
import Grades from './pages/Grades';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import CourseInfo from './pages/CourseInfo';

export type Page =
  | 'courses'
  | 'dashboard'
  | 'materials'
  | 'grades'
  | 'assessments'
  | 'resources'
  | 'course-info';

export type CoursePageNav = Exclude<Page, 'courses'>;

function App() {
  const [userId, setUserId] = useState<string | null>(() => {
    try {
      const u = localStorage.getItem('lz_user');
      return u ? (JSON.parse(u) as { id: string }).id : null;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState<Page>('courses');

  function handleLogout() {
    localStorage.removeItem('lz_token');
    localStorage.removeItem('lz_user');
    setUserId(null);
    setPage('courses');
  }

  function handleNavigate(p: CoursePageNav) {
    setPage(p);
  }

  if (!userId) {
    return <Login onSuccess={(id: string) => { setUserId(id); setPage('courses'); }} />;
  }

  if (page === 'courses') {
    return <MyCourses onEnterCourse={() => setPage('dashboard')} />;
  }

  const sharedProps = {
    onLogout:     handleLogout,
    onBackToHome: () => setPage('courses'),
    onNavigate:   handleNavigate,
  };

  if (page === 'dashboard') {
    return (
      <Home
        userId={userId}
        {...sharedProps}
        onEnterCourse={() => setPage('materials')}
      />
    );
  }

  if (page === 'materials') {
    return <CourseMaterials onBack={() => setPage('dashboard')} onLogout={handleLogout} />;
  }

  if (page === 'grades')      return <Grades      {...sharedProps} />;
  if (page === 'assessments') return <Assessments {...sharedProps} />;
  if (page === 'resources')   return <Resources   {...sharedProps} />;

  return <CourseInfo {...sharedProps} />;
}

export default App;
