import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Sparkles, CheckCircle2, AlertTriangle, Mic, Square, Play, Trash2, Clock, Calendar, Plus, RefreshCcw, Loader2, Lock } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { mockReflectionHistory, mockPhases } from '../../data/mockData';

// --- Helper Components for Live Audio Simulation ---
const LiveTranscript = ({ text, isRecording, color = "blue" }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isRecording) {
      setDisplayedText("");
      return;
    }

    let currentIndex = 0;
    const words = text.split(" ");

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText(words.slice(0, currentIndex + 1).join(" "));
        currentIndex++;
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRecording, text]);

  return (
    <div className="mt-6 p-5 bg-white rounded-2xl shadow-inner border border-slate-100 text-left w-full relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full bg-${color}-500 animate-pulse`}></div>
      <p className="text-slate-700 font-medium text-lg leading-relaxed">
        "{displayedText}
        <span className={`inline-block w-2 h-5 ml-1 bg-${color}-500 animate-pulse align-middle`}></span>"
      </p>
    </div>
  );
};

const AudioVisualizer = ({ color = "blue" }) => (
  <div className="flex items-end gap-1.5 h-16 justify-center">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
      <motion.div
        key={i}
        className={`w-2 rounded-full bg-${color}-500`}
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{
          repeat: Infinity,
          duration: 0.6 + Math.random() * 0.4,
          delay: Math.random() * 0.5
        }}
      />
    ))}
  </div>
);

export const GoalWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Phase Selection State ---
  const [selectedPhase, setSelectedPhase] = useState(() => {
    if (location.state?.phase) return location.state.phase;
    return mockPhases.find(p => p.status === 'In Progress') || mockPhases[0];
  });
  const isPhaseLocked = !!location.state?.phase;

  // --- Goal Setting State ---
  const [goals, setGoals] = useState([]);
  const [isRecordingGoal, setIsRecordingGoal] = useState(false);
  const [isProcessingGoal, setIsProcessingGoal] = useState(false);

  // Submit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // --- Reflection State ---
  const [isRecordingRef, setIsRecordingRef] = useState(false);
  const [hasRecordingRef, setHasRecordingRef] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");

  const calculateDuration = (start, end) => {
    if (!start || !end) return "0 hrs";
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60; // handle wrap around midnight
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} hrs`;
    return `${hours}h ${mins}m`;
  };

  const duration = calculateDuration(startTime, endTime);

  // --- Goal Handlers ---
  const handleStartRecordingGoal = () => {
    setIsRecordingGoal(true);
  };

  const handleStopRecordingGoal = () => {
    setIsRecordingGoal(false);
    setIsProcessingGoal(true);

    // Simulate AI parsing and grammar correction delay
    setTimeout(() => {
      setIsProcessingGoal(false);
      const newGoal = {
        id: Date.now(),
        date: selectedDate, // Bind to selected date
        phase: selectedPhase, // Bind to selected phase
        title: "Master React and Tailwind CSS",
        description: "I want to thoroughly learn React and Tailwind CSS over the next 4 weeks. I will build 3 complete projects. This is highly important for my career growth.",
        time: duration,
        priority: "High Priority"
      };
      setGoals(prev => [...prev, newGoal]);
    }, 2500);
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleBatchSubmit = () => {
    setIsValidating(true);
    setIsModalOpen(true);
    setTimeout(() => {
      setIsValidating(false);
      // Simulate random valid vs invalid for phase alignment demonstration
      const isGoalValid = Math.random() > 0.5;
      setValidationResult(isGoalValid ? 'valid' : 'invalid');
    }, 2500);
  };

  // --- Reflection Handlers ---
  const handleRecordRef = () => {
    setIsRecordingRef(true);
    setHasRecordingRef(false);
  };

  const handleStopRef = () => {
    setIsRecordingRef(false);
    setHasRecordingRef(true);
  };

  const handleDeleteRef = () => {
    setHasRecordingRef(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-6 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-sm relative overflow-hidden flex items-center">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 text-white flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-200" />
            <h1 className="text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">Architect Your Success</h1>
          </div>
          <div className="hidden md:block h-5 w-px bg-white/30"></div>
          <p className="text-blue-100/90 text-sm font-medium truncate">Speak your ambitions into existence. Reflect, refine, and relentlessly pursue greatness.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Audio Goal Setting */}
        <div className="space-y-6">

          {/* Phase Selection / Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 flex-shrink-0 rounded-lg font-black flex items-center justify-center bg-indigo-100 text-indigo-700">
                P{selectedPhase.number}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  {selectedPhase.name} <span className="ml-2 font-normal text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">Deadline: {selectedPhase.deadline}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-wide">
                  {selectedPhase.status} <span className="inline-flex items-center text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md"><Lock className="w-3 h-3 mr-1" /> Locked</span>
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto flex-shrink-0">
              <Button variant="outline" className="text-xs w-full sm:w-auto text-slate-600 border-slate-300 hover:bg-slate-50 transition-colors" onClick={() => navigate('/phases')}>
                Change Phase
              </Button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b-4 border-[var(--border-color)] pb-3 gap-3 mb-4">
            <h2 className="anime-heading text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <TargetIcon /> Goal Setting (Audio)
            </h2>

            <div className="flex flex-wrap gap-2">
              {/* Time Range Box */}
              <div className="bg-[var(--bg-main)] px-3 py-2 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span className="font-bold text-[var(--text-main)] text-[10px] uppercase tracking-wider">Start & End Time (Click to edit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-2 border-[var(--border-color)] bg-[var(--bg-main)] hover:border-[var(--color-primary)] transition-colors px-1 py-0.5 flex items-center cursor-pointer shadow-[1px_1px_0px_var(--shadow-color)]">
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-transparent text-[var(--text-main)] text-xs font-bold outline-none cursor-pointer" />
                  </div>
                  <span className="text-[var(--text-main)] font-black text-xs">→</span>
                  <div className="border-2 border-[var(--border-color)] bg-[var(--bg-main)] hover:border-[var(--color-primary)] transition-colors px-1 py-0.5 flex items-center cursor-pointer shadow-[1px_1px_0px_var(--shadow-color)]">
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-transparent text-[var(--text-main)] text-xs font-bold outline-none cursor-pointer" />
                  </div>
                  <span className="ml-1 bg-[var(--color-primary)] text-[var(--bg-main)] px-2 py-1 text-[11px] font-black border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">{duration}</span>
                </div>
              </div>

              {/* Date Selection Box */}
              <div className="bg-[var(--bg-main)] px-3 py-2 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] flex items-center gap-2">
                <label htmlFor="workspace-date" className="font-bold text-[var(--text-main)] text-xs uppercase flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--color-primary)]" /> Date:
                </label>
                <input
                  type="date"
                  id="workspace-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-[var(--text-main)] text-xs focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* List of recorded goals */}
          <AnimatePresence>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Corrected
                  </div>
                  <CardBody className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-lg pr-20">{goal.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {goal.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 font-bold uppercase tracking-wide">
                        Phase {goal.phase?.number || selectedPhase.number}
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {goal.time}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md">
                        {goal.priority}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                      <Button variant="ghost" className="text-sm px-3 py-1.5 h-auto text-slate-500 hover:text-slate-700" icon={RefreshCcw} onClick={() => handleDeleteGoal(goal.id)}>
                        Re-record
                      </Button>
                      <Button variant="ghost" className="text-sm px-3 py-1.5 h-auto text-red-500 hover:text-red-700 hover:bg-red-50" icon={Trash2} onClick={() => handleDeleteGoal(goal.id)}>
                        Discard
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Audio Input Area */}
          {(!isRecordingGoal && !isProcessingGoal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <CardBody className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-slate-600 font-medium mb-4">
                    {goals.length > 0 ? "Have another goal?" : "Speak naturally. AI will correct your English and format the goal."}
                  </p>
                  <Button
                    variant="primary"
                    icon={Mic}
                    onClick={handleStartRecordingGoal}
                    className="rounded-full px-6"
                  >
                    {goals.length > 0 ? "+ Add Another Goal" : "Describe Goal"}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Recording State (New Live UI) */}
          {isRecordingGoal && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                <CardBody className="flex flex-col items-center justify-center p-8 text-center relative z-10">
                  <AudioVisualizer color="blue" />

                  <LiveTranscript
                    isRecording={isRecordingGoal}
                    text="I want to thoroughly learn React and Tailwind CSS over the next 4 weeks. I will build 3 complete projects."
                    color="blue"
                  />

                  <div className="mt-8">
                    <Button variant="danger" icon={Square} onClick={handleStopRecordingGoal} className="rounded-full px-8 shadow-lg shadow-red-500/20">
                      Stop Recording
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* AI Processing State */}
          {isProcessingGoal && (
            <Card className="bg-blue-50/50 border-blue-100">
              <CardBody className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Processing Audio...</h3>
                <p className="text-blue-600 mt-2 text-sm">Correcting grammar and extracting SMART details.</p>
              </CardBody>
            </Card>
          )}

          {/* Final Submit Button */}
          {goals.length > 0 && !isRecordingGoal && !isProcessingGoal && (
            <div className="pt-4 pb-8">
              <Button
                variant="success"
                fullWidth
                icon={Send}
                onClick={handleBatchSubmit}
                className="text-lg py-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                Submit All Goals ({goals.length})
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Reflection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MicIcon /> Daily Reflection
            </h2>
          </div>

          <Card className={`${isRecordingRef ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50'} border-none shadow-lg transition-colors duration-500 overflow-hidden relative`}>
            {isRecordingRef && <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>}

            <CardBody className="p-6 flex flex-col items-center relative z-10">
              {!isRecordingRef && !hasRecordingRef && (
                <p className="text-slate-500 mb-6 text-center text-sm">
                  Take a moment to reflect on your day. What went well? What could be improved?
                </p>
              )}

              <div className="relative mb-2 mt-2">
                {!isRecordingRef && (
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 bg-white text-purple-500 shadow-md`}>
                    <Mic className="w-10 h-10" />
                  </div>
                )}

                {isRecordingRef && (
                  <div className="mb-4">
                    <AudioVisualizer color="purple" />
                  </div>
                )}
              </div>

              {isRecordingRef && (
                <LiveTranscript
                  isRecording={isRecordingRef}
                  text="Today was a highly productive day. I managed to finish all my tasks on time, but I really need to focus more on my weak areas tomorrow."
                  color="purple"
                />
              )}

              <div className="text-center mb-6 mt-4 h-6">
                {isRecordingRef ? (
                  <div className="flex items-center gap-2 text-purple-300 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Recording... 01:23
                  </div>
                ) : hasRecordingRef ? (
                  <p className="text-slate-600 font-medium text-sm">Recording saved. Length: 01:23</p>
                ) : (
                  <p className="text-slate-400 text-sm">Tap record to start your reflection</p>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 w-full">
                {!isRecordingRef && !hasRecordingRef && (
                  <Button onClick={handleRecordRef} variant="primary" icon={Mic} className="rounded-full px-6 text-sm bg-purple-600 hover:bg-purple-700">
                    Record Reflection
                  </Button>
                )}

                {isRecordingRef && (
                  <Button onClick={handleStopRef} variant="danger" icon={Square} className="rounded-full px-6 text-sm shadow-lg shadow-red-500/20">
                    Stop Recording
                  </Button>
                )}

                {hasRecordingRef && (
                  <>
                    <Button variant="outline" icon={Play} className="rounded-full text-sm">Play</Button>
                    <Button onClick={handleDeleteRef} variant="ghost" icon={Trash2} className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full text-sm">Delete</Button>
                    <Button variant="primary" icon={Send} className="rounded-full text-sm px-6 bg-purple-600 hover:bg-purple-700">Submit</Button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="pt-2">
            <Button variant="primary" fullWidth className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              🎤 Start AI Reflection Interview
            </Button>
          </div>


        </div>
      </div>

      {/* Goal Validation Modal (Batch Submit) */}
      <Modal isOpen={isModalOpen} onClose={() => !isValidating && setIsModalOpen(false)} title="SMART Goals Validation">
        <div className="py-6 flex flex-col items-center text-center">
          {isValidating ? (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-800">AI is analyzing {goals.length} goal(s)...</h3>
              <p className="text-slate-500 mt-2">Checking for Specific, Measurable, Achievable, Relevant, and Time-bound criteria.</p>
            </div>
          ) : validationResult === 'valid' ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">✅ Goal Validated & Approved</h3>
              <p className="text-slate-600 mb-2">Your goals follow the SMART framework.</p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 w-full text-left mb-6 text-sm text-emerald-800 shadow-sm">
                <p className="font-semibold flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" /> Strong Phase Alignment
                </p>
                <p>Your daily commitments are clearly defined and appropriately paced to complete <b>{selectedPhase.name}</b> smoothly before its deadline on <b>{selectedPhase.deadline}</b>. Excellent strategy!</p>
              </div>

              <Button onClick={() => { setIsModalOpen(false); setGoals([]); }} variant="success" fullWidth shadow="lg">
                Save and Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">❌ Phase Alignment Warning</h3>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full text-left mb-6 text-sm text-red-900 shadow-sm">
                <p className="font-semibold text-red-700 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-red-500" /> AI Feedback
                </p>
                <p className="mb-2">This goal doesn't strongly connect with the primary objectives of the <b>{selectedPhase.name}</b> phase.</p>
                <p>Additionally, based on your current pace, these daily goals are not sufficient to complete the phase by its <b>{selectedPhase.deadline}</b> deadline.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button onClick={() => setIsModalOpen(false)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" fullWidth>
                  Review Phase Objectives
                </Button>
                <Button onClick={() => { setIsModalOpen(false); setGoals([]); }} variant="danger" fullWidth icon={RefreshCcw}>
                  Re-Record Goal
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

// Tiny icon wrappers
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
);
