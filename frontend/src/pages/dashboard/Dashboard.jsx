import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Trophy, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { CircularProgress, ProgressBar } from '../../components/ui/Progress';
import { mockUser, mockDailyMotivation, mockAccountability } from '../../data/mockData';

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Good Morning, {mockUser.name} 👋
          </h1>
          <p className="text-slate-500 mt-1">Let's make today count.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-slate-700">{mockUser.streak} Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Motivation */}
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
          <CardBody className="p-8 h-full flex flex-col justify-center">
            <h3 className="text-blue-100 font-medium mb-2 uppercase tracking-wider text-sm">Daily Motivation</h3>
            <p className="text-2xl font-medium leading-relaxed">
              "{mockDailyMotivation}"
            </p>
          </CardBody>
        </Card>

        {/* Accountability Card */}
        <Card hover>
          <CardHeader>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Reminder
            </h3>
          </CardHeader>
          <CardBody>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
              <p className="text-orange-800 font-medium">{mockAccountability.todayReminder}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Morning</p>
                  <p className="text-xs text-slate-500">{mockAccountability.morning}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Evening</p>
                  <p className="text-xs text-slate-500">{mockAccountability.evening}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Goal Progress */}
        <Card hover className="md:col-span-1">
          <CardBody className="flex flex-col items-center justify-center text-center p-8">
            <h3 className="font-semibold text-slate-800 mb-6">Today's Goal Progress</h3>
            <CircularProgress progress={75} size={160} strokeWidth={12} color="text-green-500" />
            <p className="text-slate-500 mt-6 text-sm">
              You are almost there! Keep pushing.
            </p>
          </CardBody>
        </Card>

        {/* Active Phase */}
        <Card hover className="md:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Current Phase: Execution & Consistency
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Phase 3 Progress</span>
                  <span className="text-sm font-bold text-slate-800">65%</span>
                </div>
                <ProgressBar progress={65} color="bg-purple-500" className="h-3" />
                <p className="text-slate-500 text-sm mt-4">
                  Focus on building daily habits and tracking your SMART goals consistently.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <button className="w-full md:w-auto px-6 py-3 bg-purple-100 text-purple-700 font-medium rounded-xl hover:bg-purple-200 transition-colors">
                  Continue Phase
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
