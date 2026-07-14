import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, Sparkles, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const GoalSetting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // 'valid' | 'invalid' | null

  const priorityOptions = [
    { label: 'High Priority', value: 'High' },
    { label: 'Medium Priority', value: 'Medium' },
    { label: 'Low Priority', value: 'Low' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);
    setIsModalOpen(true);
    
    // Simulate AI validation delay
    setTimeout(() => {
      setIsValidating(false);
      // Randomly choose valid or invalid for demo purposes
      setValidationResult(Math.random() > 0.5 ? 'valid' : 'invalid');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Set a New Goal</h1>
        <p className="text-slate-500 mt-1">Define your objective using the SMART framework.</p>
      </div>

      <Card className="shadow-xl">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h2>
              <Input label="Goal Title" placeholder="E.g., Complete Advanced React Course" required />
              
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">Goal Description</label>
                <textarea 
                  className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[100px]"
                  placeholder="Describe your goal in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Expected Completion Time" placeholder="e.g. 40 hours" required />
                <Input label="Deadline" type="date" required />
                <Select label="Priority" options={priorityOptions} required defaultValue="" />
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Deep Dive</h2>
              
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">Why is this goal important?</label>
                <textarea className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[80px]" required />
              </div>
              
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">Possible Challenges</label>
                <textarea className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[80px]" required />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">How will you overcome them?</label>
                <textarea className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[80px]" required />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">Resources Required</label>
                <textarea className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[80px]" placeholder="Books, courses, tools, mentorship..." required />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-100">
              <Button variant="ghost" icon={Save}>Save Draft</Button>
              <Button variant="outline" icon={RefreshCcw}>Edit Goal</Button>
              <Button variant="primary" type="submit" icon={Send}>Submit Goal</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => !isValidating && setIsModalOpen(false)} title="SMART Goal Validation">
        <div className="py-6 flex flex-col items-center text-center">
          {isValidating ? (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-800">AI is analyzing your goal...</h3>
              <p className="text-slate-500 mt-2">Checking for Specific, Measurable, Achievable, Relevant, and Time-bound criteria.</p>
            </div>
          ) : validationResult === 'valid' ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">✅ Goal Approved</h3>
              <p className="text-slate-600 mb-8">Your goal perfectly follows the SMART framework. You are ready to execute!</p>
              <Button onClick={() => setIsModalOpen(false)} variant="success" fullWidth>
                Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">❌ Goal Needs Improvement</h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full text-left mb-6 text-sm text-slate-700">
                <p className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI Suggestion
                </p>
                <p>Your goal lacks a specific measurement for success. Try adding a concrete metric, like "Complete 5 modules per week" instead of just "Complete course."</p>
              </div>

              <div className="flex gap-4 w-full">
                <Button onClick={() => setIsModalOpen(false)} variant="outline" fullWidth>
                  Edit Goal
                </Button>
                <Button variant="primary" fullWidth icon={Sparkles}>
                  Improve with AI
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
