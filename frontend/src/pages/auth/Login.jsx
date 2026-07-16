import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginUser } from '../../services/authApi';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setLoading(true);
    setError('');

    try {
      const data = await loginUser(payload);
      localStorage.setItem('smart-track-auth', JSON.stringify(data));
      navigate('/phases', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to log in.');
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
              <h1 className="text-2xl font-bold text-slate-800">Welcome Back 👋</h1>
              <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
            </div>

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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

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

              <p className="text-center mt-6 text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
