import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CourseMaterials from './pages/CourseMaterials';
import Grades from './pages/Grades';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import CourseInfo from './pages/CourseInfo';
import CourseSummary from './pages/CourseSummary';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';

// App.tsx manages the top-level page state and the authentication gate.
// It chooses which page component to render based on the current page.
export type Page =
  | 'home'
  | 'dashboard'
  | 'grades'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'materials'
  | 'assessments'
  | 'resources'
  | 'course-info'
  | 'course-summary';

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
  const [archiveBlock, setArchiveBlock] = useState<number>(1);

  // Helpers to map between app pages and readable paths
  const pageToPath = (p: Page) => (p === 'home' ? '/' : `/${p}`);
  const pathToPage = (path: string): Page => {
    const p = path.replace(/^\/+/, '').split('/')[0];
    if (!p) return 'home';
    const known: Page[] = [
      'dashboard','grades','notifications','profile','settings',
      'materials','assessments','resources','course-info','course-summary',
    ];
    return (known.includes(p as Page) ? (p as Page) : 'home');
  };

  function handleLogout() {
    localStorage.removeItem('lz_token');
    localStorage.removeItem('lz_user');
    setUserId(null);
    setPage('home');
  }

  // Simple page switcher used by sidebars and buttons.
  function handleNavigate(p: CoursePageNav) {
    const path = pageToPath(p as Page);
    try { window.history.pushState({ page: p }, '', path); } catch {}
    setPage(p);
  }

  // General navigator that also supports 'home'
  function navigate(p: Page) {
    if (p === 'home') {
      const path = pageToPath(p);
      try { window.history.pushState({ page: p }, '', path); } catch {}
      setPage('home');
      return;
    }
    handleNavigate(p as CoursePageNav);
  }

  // Keep app state in sync with browser history (back/forward and direct links)
  useEffect(() => {
    // Initialize page from history state or location
    const initial = (history.state && (history.state as any).page) ? (history.state as any).page as Page : pathToPage(location.pathname);
    setPage(initial);

    const onPop = (e: PopStateEvent) => {
      const statePage = e.state?.page ?? pathToPage(location.pathname);
      setPage(statePage as Page);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // If no user is logged in, render the login page only.
  if (!userId) {
     return <Login onSuccess={(id: string) => { setUserId(id); navigate('home'); }} />;
  }

  // ── Render current page ───────────────────────────────────────────────────
  function renderPage() {
    // Level 1: Home page shown after login, before entering the course.
    if (page === 'home') {
      return (
        <Home
          onEnterCourse={() => handleNavigate('dashboard')}
          onContinueLearning={() => handleNavigate('materials')}
          onViewCourse={(block) => { setArchiveBlock(block); handleNavigate('course-summary'); }}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // Read-only summary of a completed course (Blocks 1–3 on the Home timeline).
    if (page === 'course-summary') {
      return (
        <CourseSummary
          courseBlock={archiveBlock}
              onBack={() => navigate('home')}
              onHome={() => navigate('home')}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // Level 2: Student home pages that use the student sidebar.
    if (page === 'dashboard') {
      return (
        <Dashboard
          userId={userId!}
              onBack={() => navigate('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (page === 'grades') {
      return (
        <Grades
              onBack={() => navigate('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (page === 'notifications') {
      return (
        <Notifications
              onBack={() => navigate('home')}
          onNavigate={handleNavigate}
        />
      );
    }

    if (page === 'profile') {
      return (
        <Profile
              onBack={() => navigate('home')}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    if (page === 'settings') {
      return (
        <Settings
              onBack={() => navigate('home')}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // Level 3: Course-specific pages that use the course sidebar.

    // Level 3: Course pages (course sidebar)
    const courseBack = () => handleNavigate('dashboard');
    const courseHome = () => navigate('home');

    if (page === 'materials')   return <CourseMaterials onBack={courseBack} onHome={courseHome} onNavigate={handleNavigate} />;
    if (page === 'assessments') return <Assessments    onBack={courseBack} onHome={courseHome} onNavigate={handleNavigate} />;
    if (page === 'resources')   return <Resources      onBack={courseBack} onHome={courseHome} onNavigate={handleNavigate} />;

    // course-info
    return (
      <CourseInfo
        onBack={courseBack}
        onHome={courseHome}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      {renderPage()}
      <NotificationDrawer onNavigate={(p) => { handleNavigate(p as CoursePageNav); }} />
      <NotificationToast  onNavigate={(p) => { handleNavigate(p as CoursePageNav); }} />
    </>
  );
}

export default App;
