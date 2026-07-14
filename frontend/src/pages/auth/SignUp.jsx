import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/phases');
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

            <form onSubmit={handleSignUp}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Sheikh..."
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="sheikh@example.com"
                  required
                />
                <Select
                  label="Campus"
                  options={campusOptions}
                  required
                  defaultValue=""
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  required
                  defaultValue=""
                />
                <div className="md:col-span-2">
                  <Input
                    label="Joining Date"
                    type="date"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button type="submit" fullWidth icon={UserPlus} className="text-base order-1 sm:order-2">
                  Create Account
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  fullWidth 
                  onClick={() => navigate('/')} 
                  className="text-base order-2 sm:order-1"
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
