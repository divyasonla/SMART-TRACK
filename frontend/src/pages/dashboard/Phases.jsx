import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Phases = () => {
  const navigate = useNavigate();
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  // Function to load user's phase progress from the backend
  const fetchPhases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/v1/phases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch phase progress.');
      }

      const resData = await response.json();
      setPhases(resData.data.phases);
    } catch (err) {
      console.error('Error fetching phases:', err);
      setError(err.message || 'Could not retrieve your journey progress. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchPhases();
  }, []);

  // Handler to mark the current active phase as completed
  const handleCompletePhase = async (phaseNumber) => {
    setCompletingId(phaseNumber);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/v1/phases/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phase: phaseNumber }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Could not update your phase status.');
      }

      // Re-fetch progress to automatically update the dashboard
      await fetchPhases();
    } catch (err) {
      alert(err.message);
    } finally {
      setCompletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
<<<<<<< Updated upstream
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Locked': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
=======
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/20';
      case 'Locked':
        return 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
>>>>>>> Stashed changes
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 mr-1.5 text-green-600" />;
      case 'Locked':
        return <Lock className="w-4 h-4 mr-1.5 text-slate-400" />;
      case 'In Progress':
        return <RefreshCw className="w-4 h-4 mr-1.5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading your SMART track journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="border-red-200 bg-red-50/50">
          <CardBody className="flex flex-col items-center text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Phases</h3>
            <p className="text-red-700 text-sm mb-6">{error}</p>
            <Button variant="primary" onClick={() => { setLoading(true); setError(null); fetchPhases(); }}>
              Retry Connection
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

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

<<<<<<< Updated upstream
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
=======
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase, index) => {
          const isLocked = phase.status === 'Locked';
          const isActive = phase.status === 'In Progress';
          const isCompleted = phase.status === 'Completed';
>>>>>>> Stashed changes

          return (
            <motion.div
              key={phase.id}
<<<<<<< Updated upstream
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
=======
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card 
                hover={!isLocked}
                className={`h-full flex flex-col transition-all duration-300 ${
                  isLocked 
                    ? 'opacity-60 grayscale-[0.6] cursor-not-allowed border-slate-100 shadow-none' 
                    : isActive
                      ? 'ring-2 ring-blue-600/30 border-blue-200 shadow-md shadow-blue-500/5'
                      : 'border-slate-200/80 shadow-sm'
                }`}
              >
                <CardBody className="flex flex-col flex-1 p-6">
                  {/* Badge & Number */}
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-inner ${
                      isLocked
                        ? 'bg-slate-100 text-slate-400'
                        : isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      P{phase.number}
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center ${getStatusColor(phase.status)}`}>
>>>>>>> Stashed changes
                      {getStatusIcon(phase.status)}
                      {phase.status}
                    </span>
                  </div>
                  
<<<<<<< Updated upstream
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
=======
                  {/* Phase Title */}
                  <h3 className="text-lg font-bold text-slate-800 mb-2 flex-1 line-clamp-2">
                    {phase.name}
                  </h3>
                  
                  {/* Timeline */}
                  <p className="text-xs text-slate-400 font-medium mb-4">
                    Timeline: <span className="text-slate-600">{phase.timeline}</span>
                  </p>

                  {/* Syllabus / Key Concepts */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Concepts</p>
                    <div className="flex flex-wrap gap-1.5 max-h-[76px] overflow-y-auto pr-1">
                      {phase.concepts && phase.concepts.slice(0, 3).map((concept, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-full"
                          title={concept}
                        >
                          {concept}
                        </span>
                      ))}
                      {phase.concepts && phase.concepts.length > 3 && (
                        <span className="text-xs text-slate-400 font-medium self-center ml-1">
                          +{phase.concepts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between mb-6 pt-2 border-t border-slate-50">
                    <CircularProgress 
                      progress={phase.progress} 
                      size={70} 
                      strokeWidth={5} 
                      color={isCompleted ? 'text-green-500' : 'text-blue-500'} 
                    />
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Completion</p>
                      <p className="text-xl font-bold text-slate-800">{phase.progress}%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-slate-100/80">
                    {isLocked ? (
                      <Button variant="ghost" fullWidth disabled icon={Lock}>Locked</Button>
                    ) : isCompleted ? (
                      <Button variant="outline" fullWidth onClick={() => navigate('/goals/new')}>Review Phase</Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="primary"
                          fullWidth
                          icon={Play}
                          onClick={() => navigate('/goals/new')}
                        >
                          Start / Continue Goal
                        </Button>
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => { setSelectedPhase(phase); setShowModal(true); }}
                        >
                          Read More
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
>>>>>>> Stashed changes
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
