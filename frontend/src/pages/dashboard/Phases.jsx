import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { mockPhases } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Phases = () => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Locked': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'Locked': return <Lock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Your Journey</h1>
        <p className="text-slate-500 mt-1">Complete each phase to master the SMART framework.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPhases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover className={`h-full flex flex-col ${phase.status === 'Locked' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              <CardBody className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-600 shadow-inner">
                    P{phase.number}
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center ${getStatusColor(phase.status)}`}>
                    {getStatusIcon(phase.status)}
                    {phase.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex-1">{phase.name}</h3>
                
                <div className="flex items-center justify-between mb-8">
                  <CircularProgress 
                    progress={phase.progress} 
                    size={80} 
                    strokeWidth={6} 
                    color={phase.status === 'Completed' ? 'text-green-500' : 'text-blue-500'} 
                  />
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Completion</p>
                    <p className="text-2xl font-bold text-slate-800">{phase.progress}%</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  {phase.status === 'Locked' ? (
                    <Button variant="ghost" fullWidth disabled icon={Lock}>
                      Locked
                    </Button>
                  ) : phase.status === 'Completed' ? (
                    <Button variant="outline" fullWidth onClick={() => navigate('/goals/new')}>
                      Review Phase
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      fullWidth 
                      icon={phase.progress === 0 ? Play : ArrowRight}
                      onClick={() => navigate('/goals/new')}
                    >
                      {phase.progress === 0 ? 'Start Phase' : 'Continue Phase'}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
