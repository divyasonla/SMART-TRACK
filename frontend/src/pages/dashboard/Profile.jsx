import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Activity, Edit3, LogOut, Award } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockUser, mockPhases } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and track your achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <Card className="md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <CardBody className="pt-20 pb-8 px-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0">
                <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{mockUser.name}</h2>
                <p className="text-slate-500 font-medium">Student at SMART-TRACK</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" icon={Edit3} className="px-4 py-2 text-sm">Edit Profile</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-800">{mockUser.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Campus</p>
                  <p className="font-medium text-slate-800">{mockUser.campus}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Joining Date</p>
                  <p className="font-medium text-slate-800">{new Date(mockUser.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Current Phase</p>
                  <p className="font-medium text-slate-800">
                    Phase {mockUser.currentPhase}: {mockPhases.find(p => p.number === mockUser.currentPhase)?.name}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Side Cards */}
        <div className="md:col-span-1 space-y-6">
          <Card hover>
            <CardBody className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {mockUser.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <Button 
                variant="danger" 
                fullWidth 
                icon={LogOut} 
                onClick={() => navigate('/')}
              >
                Logout
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
