import { useState } from 'react';
import Login from './pages/Login';
import MyCourses from './pages/MyCourses';
import Home from './pages/Home';
import CourseMaterials from './pages/CourseMaterials';

type Page = 'courses' | 'dashboard' | 'materials';

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

  if (!userId) {
    return <Login onSuccess={(id: string) => { setUserId(id); setPage('courses'); }} />;
  }

  if (page === 'courses') {
    return <MyCourses onEnterCourse={() => setPage('dashboard')} />;
  }

  if (page === 'dashboard') {
    return (
      <Home
        userId={userId}
        onLogout={handleLogout}
        onBackToHome={() => setPage('courses')}
        onEnterCourse={() => setPage('materials')}
      />
    );
  }

  return <CourseMaterials onBack={() => setPage('dashboard')} onLogout={handleLogout} />;
}

export default App;
