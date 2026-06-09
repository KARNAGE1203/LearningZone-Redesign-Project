import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CourseMaterials from './pages/CourseMaterials';
import CourseOverview from './pages/CourseOverview';
import Grades from './pages/Grades';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import CourseInfo from './pages/CourseInfo';
import Notifications from './pages/Notifications';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';

export type Page =
  | 'home'
  | 'dashboard'
  | 'grades'
  | 'notifications'
  | 'overview'
  | 'materials'
  | 'assessments'
  | 'resources'
  | 'course-info';

export type CoursePageNav = Exclude<Page, 'home'>;

function App() {
  const [userId, setUserId] = useState<string | null>(() => {
    try {
      const u = localStorage.getItem('lz_user');
      return u ? (JSON.parse(u) as { id: string }).id : null;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState<Page>('home');

  function handleLogout() {
    localStorage.removeItem('lz_token');
    localStorage.removeItem('lz_user');
    setUserId(null);
    setPage('home');
  }

  function handleNavigate(p: CoursePageNav) {
    setPage(p);
  }

  if (!userId) {
    return <Login onSuccess={(id: string) => { setUserId(id); setPage('home'); }} />;
  }

  // ── Render current page ───────────────────────────────────────────────────
  function renderPage() {
    // Level 1: Home (top nav only)
    if (page === 'home') {
      return (
        <Home
          onEnterCourse={() => setPage('dashboard')}
          onContinueLearning={() => setPage('materials')}
        />
      );
    }

    // Level 2: Student pages (student sidebar)
    if (page === 'dashboard') {
      return (
        <Dashboard
          userId={userId!}
          onBack={() => setPage('home')}
          onEnterCourse={() => setPage('overview')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (page === 'grades') {
      return (
        <Grades
          onBack={() => setPage('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (page === 'notifications') {
      return (
        <Notifications
          onBack={() => setPage('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    // Level 3: Course pages (course sidebar)
    const courseBack = () => setPage('dashboard');

    if (page === 'overview')    return <CourseOverview onBack={courseBack} onNavigate={handleNavigate} />;
    if (page === 'materials')   return <CourseMaterials onBack={courseBack} onNavigate={handleNavigate} />;
    if (page === 'assessments') return <Assessments    onBack={courseBack} onNavigate={handleNavigate} />;
    if (page === 'resources')   return <Resources      onBack={courseBack} onNavigate={handleNavigate} />;

    // course-info
    return (
      <CourseInfo
        onBack={courseBack}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      {renderPage()}
      <NotificationDrawer onNavigate={(p) => { setPage(p as Page); }} />
      <NotificationToast  onNavigate={(p) => { setPage(p as Page); }} />
    </>
  );
}

export default App;
