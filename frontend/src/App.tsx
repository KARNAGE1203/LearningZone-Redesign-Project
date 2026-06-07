import { useState } from 'react';
import Login from '@/pages/Login';
import Home from '@/pages/Home';

function App() {
  const [userId, setUserId] = useState<string | null>(() => {
    try {
      const u = localStorage.getItem('lz_user');
      return u ? (JSON.parse(u) as { id: string }).id : null;
    } catch {
      return null;
    }
  });

  function handleLogout() {
    localStorage.removeItem('lz_token');
    localStorage.removeItem('lz_user');
    setUserId(null);
  }

  if (!userId) {
    return <Login onSuccess={(id) => setUserId(id)} />;
  }

  return <Home userId={userId} onLogout={handleLogout} />;
}

export default App;
