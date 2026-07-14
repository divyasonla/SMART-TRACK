import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [gender, setGender] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Make sure enums are filled
    if (!campus || !gender) {
      setErrorMsg('Please select both your campus and gender.');
      setLoading(false);
      return;
    }

    try {
      await signup({
        name,
        email,
        campus,
        gender,
        joiningDate,
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const campusOptions = [
    { label: 'Dantewada', value: 'Dantewada' },
    { label: 'Sarjapur', value: 'Sarjapur' },
    { label: 'Kishanganj', value: 'Kishanganj' },
    { label: 'Raigarh', value: 'Raigarh' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10 my-8"
      >
        <Card className="shadow-2xl">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Create an Account</h1>
              <p className="text-slate-500 mt-2">Join SMART-TRACK and achieve your goals</p>
            </div>

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

            <form onSubmit={handleSignUp}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Sheikh..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="sheikh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <Select
                  label="Campus"
                  options={campusOptions}
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  required
                  disabled={loading}
                  defaultValue=""
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  disabled={loading}
                  defaultValue=""
                />
                <div className="md:col-span-2">
                  <Input
                    label="Joining Date"
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  fullWidth
                  icon={UserPlus}
                  className="text-base order-1 sm:order-2"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/')}
                  className="text-base order-2 sm:order-1"
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
