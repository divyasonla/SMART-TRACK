import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Percent, Mic, Flame, Award } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { mockChartData, mockUser } from '../../data/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card hover className="h-full">
      <CardBody className="flex items-center p-6 gap-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-20 flex-shrink-0`}>
          <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-').replace('-100', '-600')}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your progress and execution consistency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Goals Created" value="42" icon={Target} color="bg-blue-100" delay={0.1} />
        <StatCard title="Goals Completed" value="28" icon={CheckCircle2} color="bg-green-100" delay={0.2} />
        <StatCard title="Completion Rate" value="66%" icon={Percent} color="bg-purple-100" delay={0.3} />
        <StatCard title="Reflection Submitted" value="124" icon={Mic} color="bg-orange-100" delay={0.4} />
        <StatCard title="Current Streak" value={`${mockUser.streak} Days`} icon={Flame} color="bg-red-100" delay={0.5} />
        <StatCard title="Interview Score" value={`${mockUser.interviewScore}/100`} icon={Award} color="bg-yellow-100" delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-96">
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Weekly Progress (Created vs Completed)</h3>
            </CardHeader>
            <CardBody className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="created" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCreated)" name="Goals Created" />
                  <Area type="monotone" dataKey="completed" stroke="#22c55e" fillOpacity={1} fill="url(#colorCompleted)" name="Goals Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-96">
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Daily Execution</h3>
            </CardHeader>
            <CardBody className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Legend />
                  <Bar dataKey="completed" name="Tasks Executed" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
