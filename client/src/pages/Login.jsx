import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/AuthIllustration';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container container-fluid py-5">
      <div className="row align-items-center justify-content-center min-vh-75">
        {/* Left Side: Illustration */}
        <div className="col-lg-6 col-md-6 text-center mb-4 mb-md-0">
          <AuthIllustration />
        </div>

        {/* Right Side: Form matching Screenshot 2 */}
        <div className="col-lg-5 col-md-6 col-sm-10 col-12">
          <div className="auth-form-wrapper px-md-4">
            <h4 className="fw-bold mb-4 auth-heading">Login for the Account</h4>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn w-auto px-5 py-2 text-uppercase fw-semibold"
                disabled={loading}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              <div className="mt-4">
                <span className="text-dark">Don't have an account? </span>
                <Link to="/register" className="auth-switch-link fw-bold">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;