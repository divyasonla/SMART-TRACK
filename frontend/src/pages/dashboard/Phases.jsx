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
      case 'Locked': return 'bg-red-100 text-red-600 border-red-200';
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
      className="space-y-10 pb-10"
    >
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl opacity-30 pointer-events-none -z-10"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3 tracking-tight">
          Dominate Your Objectives
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Unlock your true potential. Crush your goals phase by phase and track your unstoppable progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {mockPhases.map((phase, index) => {
          // Dynamic colors based on phase status for the 3D effect
          const cardGradients = {
            'Completed': 'from-emerald-50 to-teal-50 border-emerald-200/50 shadow-emerald-500/10 hover:shadow-emerald-500/20',
            'In Progress': 'from-blue-50 to-indigo-50 border-blue-200/50 shadow-blue-500/10 hover:shadow-blue-500/20',
            'Locked': 'from-red-50 to-rose-50 border-red-200/50 shadow-red-500/5 hover:shadow-red-500/10',
          };
          
          const iconGradients = {
            'Completed': 'from-emerald-400 to-teal-500 shadow-emerald-500/30',
            'In Progress': 'from-blue-400 to-indigo-500 shadow-blue-500/30',
            'Locked': 'from-red-300 to-rose-400 shadow-red-500/20',
          };

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="h-full"
            >
              <div 
                className={`h-full flex flex-col relative rounded-2xl border-t border-white/60 bg-gradient-to-br ${cardGradients[phase.status] || cardGradients['Locked']} transition-all duration-300 transform hover:-translate-y-2 shadow-xl ${phase.status === 'Locked' ? 'opacity-80 grayscale-[0.2]' : ''}`}
                style={{
                  boxShadow: phase.status !== 'Locked' ? '0 20px 40px -15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7)' : '0 10px 20px -10px rgba(0,0,0,0.05)',
                }}
              >
                <div className="p-5 flex flex-col flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white bg-gradient-to-br ${iconGradients[phase.status] || iconGradients['Locked']} shadow-lg`}>
                      P{phase.number}
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border flex items-center shadow-sm ${getStatusColor(phase.status)}`}>
                      {getStatusIcon(phase.status)}
                      {phase.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4 leading-tight line-clamp-2 min-h-[3rem]">{phase.name}</h3>
                  
                  <div className="flex items-center justify-between mb-5 bg-white/40 p-3 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
                    <CircularProgress 
                      progress={phase.progress} 
                      size={54} 
                      strokeWidth={5} 
                      color={phase.status === 'Completed' ? 'text-emerald-500' : phase.status === 'Locked' ? 'text-red-400' : 'text-blue-500'} 
                    />
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completion</p>
                      <p className="text-xl font-black text-slate-800">{phase.progress}%</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-3">
                    {phase.status === 'Locked' ? (
                      <Button variant="ghost" fullWidth disabled icon={Lock} className="text-xs py-2 bg-red-100/50 text-red-500">
                        Locked
                      </Button>
                    ) : phase.status === 'Completed' ? (
                      <Button variant="outline" fullWidth onClick={() => navigate('/workspace', { state: { phase } })} className="text-xs py-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 shadow-sm">
                        Review Phase
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        fullWidth 
                        icon={phase.progress === 0 ? Play : ArrowRight}
                        onClick={() => navigate('/workspace', { state: { phase } })}
                        className="text-xs py-2 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-none"
                      >
                        {phase.progress === 0 ? 'Start Phase' : 'Continue Phase'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
