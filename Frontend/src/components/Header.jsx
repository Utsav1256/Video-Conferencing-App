import { Link, useNavigate } from 'react-router-dom';
import { Video, Home, LogIn } from 'lucide-react';
import './Header.css';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/');
  };
  const getInitials = (u) => {
    const source = (u?.name || u?.email || '').trim();
    if (!source) return '?';
    const parts = source.split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return (first + last).toUpperCase();
  };
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Video className="logo-icon" size={28} strokeWidth={2.5} />
          <span className="logo-text">VideoMeet</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/meeting/demo" className="nav-link">
            <LogIn size={18} />
            <span>Join Demo</span>
          </Link>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  className="avatar"
                  src={user.photoURL}
                  alt={user.name || 'User'}
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                <span
                  className="avatar avatar-initials"
                  style={{ width: 24, height: 24, lineHeight: '24px' }}
                >
                  {getInitials(user)}
                </span>
              )}
              <button className="btn btn-outline btn-compact" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/login">Sign in</Link>
              <Link className="btn btn-primary btn-compact" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
