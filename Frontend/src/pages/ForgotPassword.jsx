import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import { forgotPassword } from '../services/auth';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devToken, setDevToken] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevToken('');
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res?.message || 'If the account exists, an email has been sent.');
      if (res?.resetToken) {
        setDevToken(res.resetToken);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Send size={20} style={{ color: '#1a73e8' }}/>
          <h2 className="auth-title" style={{ color: '#1a73e8' }}>Forgot password</h2>
        </div>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-input-group">
            <Mail size={16} className="auth-input-icon" />
            <input className="auth-input with-icon" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-error" style={{ background:'#e1f3e8', color:'#14532d', borderColor:'#bbf7d0' }}>{success}</div>}
          <div className="auth-actions">
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
          </div>
        </form>
        {devToken && (
          <div className="auth-alt" style={{ marginTop: 12 }}>
            Dev token: <code>{devToken}</code> → <Link to={`/reset-password/${devToken}`}>Reset now</Link>
          </div>
        )}
        <div className="auth-alt"><Link to="/login">Back to sign in</Link></div>
      </div>
    </div>
  );
}


