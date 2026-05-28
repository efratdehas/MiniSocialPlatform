import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { CommentsProvider } from './context/CommentsContext';

// רכיבי Auth
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';

// רכיבי הבית והמעטפת
import Home from './components/Home/Home';
import WelcomePage from './components/Home/WelcomePage/WelcomePage';

// רכיבי מידע משתמש
import Info from './components/Info/Info';

// רכיבי פוסטים
import Posts from './components/Posts/Posts';
import PostItem from './components/Posts/PostItem/PostItem';

import './App.css';

function AppRoutes() {
  // משתמשים במשתנים המאובטחים והמעודכנים
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Initializing App...</div>;
  }

  return (
    <Routes>
      {/* נתיב ברירת מחדל - אם מחובר עובר לדף הבית שלו, אם לא למסך התחברות */}
      <Route path="/" element={user ? <Navigate to={`/users/${user.id}`} /> : <Navigate to="/login" />} />

      {/* מסכי התחברות והרשמה */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* אזור מוגן - פתוח רק למשתמש מחובר */}
      <Route
        path="/users/:id"
        element={user ? <Home /> : <Navigate to="/login" />}
      >
        {/* עמוד ברוכים הבאים הפנימי */}
        <Route index element={<WelcomePage />} />

        {/* מודול הפוסטים והתגובות של האפליקציה */}
        <Route path="posts" element={
          <PostsProvider>
            <CommentsProvider>
              <Outlet />
            </CommentsProvider>
          </PostsProvider>
        }>
          <Route index element={<Posts />} />
        </Route>

        {/* מודול המידע של המשתמש */}
        <Route path="info" element={<Info />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;