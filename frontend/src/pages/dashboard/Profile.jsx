import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Activity, Edit3, LogOut, Award, Save, X } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockUser, mockPhases } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    campus: mockUser.campus
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset back to original
    setProfileData({
      name: mockUser.name,
      email: mockUser.email,
      campus: mockUser.campus
    });
    setIsEditing(false);
  };

  // Get first letter for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

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
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-4xl font-black text-blue-600">{getInitial(profileData.name)}</span>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    value={profileData.name} 
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
                )}
                <p className="text-slate-500 font-medium mt-1">Student at SMART-TRACK</p>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" icon={X} onClick={handleCancel} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</Button>
                    <Button variant="success" icon={Save} onClick={handleSave} className="px-4 py-2 text-sm">Save Profile</Button>
                  </>
                ) : (
                  <Button variant="outline" icon={Edit3} onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm">Edit Profile</Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-1" />
                <div className="flex-1 w-full">
                  <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email} 
                      onChange={handleInputChange}
                      className="font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-slate-800">{profileData.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                <div className="flex-1 w-full">
                  <p className="text-sm font-medium text-slate-500 mb-1">Campus</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="campus"
                      value={profileData.campus} 
                      onChange={handleInputChange}
                      className="font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-slate-800">{profileData.campus}</p>
                  )}
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

