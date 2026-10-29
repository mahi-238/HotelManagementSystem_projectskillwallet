import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/AuthIllustration';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !phone) {
      setError('Please fill in all the required fields');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, phone, role });
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Try again.'
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

        {/* Right Side: Form matching Screenshot 1 */}
        <div className="col-lg-5 col-md-6 col-sm-10 col-12">
          <div className="auth-form-wrapper px-md-4">
            <h4 className="fw-bold mb-4 auth-heading">Register for the Account</h4>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  placeholder="Enter Mobile no."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* SELECT USER dropdown matching Screenshot 1 */}
              <div className="mb-3">
                <select
                  className="form-select auth-select w-auto fw-bold text-uppercase py-2 px-3 text-white bg-primary border-0 rounded"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user" className="bg-white text-dark">SELECT USER: User</option>
                  <option value="admin" className="bg-white text-dark">SELECT USER: Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn w-auto px-5 py-2 text-uppercase fw-semibold"
                disabled={loading}
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </button>

              <div className="mt-4">
                <span className="text-dark">Had an account? </span>
                <Link to="/login" className="auth-switch-link fw-bold">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;