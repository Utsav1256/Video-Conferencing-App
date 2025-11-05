import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../services/auth';
import './Auth.css';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <KeyRound size={20} style={{ color: '#1a73e8' }}/>
                  <h2 className="auth-title" style={{ color: '#1a73e8' }}>Reset password</h2>
        </div>
        <p className="auth-subtitle">Choose a new password for your account</p>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-input-group">
            <Lock size={16} className="auth-input-icon" />
            <input className="auth-input with-icon" type={showPassword ? 'text' : 'password'} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="auth-input-trailing" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-error" style={{ background:'#e1f3e8', color:'#14532d', borderColor:'#bbf7d0', display:'flex', alignItems:'center', gap:8 }}>
              <CheckCircle2 size={16} /> Password reset successful. Redirecting…
            </div>
          )}
          <div className="auth-actions">
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
          </div>
        </form>
        <div className="auth-alt"><Link to="/login">Back to sign in</Link></div>
      </div>
    </div>
  );
}


