import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
<<<<<<< Updated upstream
import { LogIn } from 'lucide-react';
=======
import { LogIn, AlertCircle, CheckCircle, Mail, Key } from 'lucide-react';
>>>>>>> Stashed changes
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginUser } from '../../services/authApi';

export const Login = () => {
  const navigate = useNavigate();
<<<<<<< Updated upstream
=======
  const { login, user } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/phases');
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> Stashed changes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setLoading(true);
    setError('');

    try {
<<<<<<< Updated upstream
      const data = await loginUser(payload);
      localStorage.setItem('smart-track-auth', JSON.stringify(data));
      navigate('/phases', { replace: true });
=======
      const user = await login(email, password);
      console.log('Login response user:', user);
      setSuccessMsg('Login successful!');
      console.log('Navigating to /phases');
      navigate('/phases');
>>>>>>> Stashed changes
    } catch (err) {
      setError(err.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('http://localhost:5001/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request OTP');
      }
      setOtpSent(true);
      setSuccessMsg(data.message || 'OTP sent successfully!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Verify the OTP first to get the secure resetToken
      const verifyResponse = await fetch('http://localhost:5001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: otpToken }),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Invalid or expired OTP');
      }

      // 2. Use the secure resetToken to reset the password
      const response = await fetch('http://localhost:5001/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      setSuccessMsg('Password updated successfully! Please log in.');
      setOtpSent(false);
      setForgotEmail('');
      setOtpToken('');
      setNewPassword('');
      setIsForgotMode(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                <span className="text-white text-3xl font-bold">S</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {isForgotMode ? 'Reset Password' : 'Welcome Back 👋'}
              </h1>
              <p className="text-slate-500 mt-2">
                {isForgotMode
                  ? 'Follow the steps to recover your password'
                  : 'Sign in to your account to continue'}
              </p>
            </div>

<<<<<<< Updated upstream
            <form onSubmit={handleLogin}>
              <Input
                label="Email Address"
                type="email"
                placeholder="sheikh@example.com"
                name="email"
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                name="password"
                required
              />

              {error && (
                <p className="mb-4 text-sm font-semibold text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center text-sm text-slate-600">
                  <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>

              <Button type="submit" fullWidth icon={LogIn} className="mb-4 text-base" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
=======
            {/* Error Message Box */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Success Message Box */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-600 text-sm"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {isForgotMode ? (
              otpSent ? (
                <form onSubmit={handleResetPassword}>
                  <Input
                    label="Enter OTP / Reset Token"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    icon={Key}
                    className="mb-4 text-base"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Update Password'}
                  </Button>
>>>>>>> Stashed changes

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(false);
                        setOtpSent(false);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRequestOTP}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="sheikh@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    icon={Mail}
                    className="mb-4 text-base"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset OTP'}
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(false);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleLogin}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="sheikh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <div className="flex justify-between items-center mb-6">
                  <label className="flex items-center text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  icon={LogIn}
                  className="mb-4 text-base"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

<<<<<<< Updated upstream
              <Button type="button" variant="outline" fullWidth className="text-base flex justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </Button>
=======
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  className="text-base flex justify-center"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Google
                </Button>
>>>>>>> Stashed changes

                <p className="text-center mt-6 text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
