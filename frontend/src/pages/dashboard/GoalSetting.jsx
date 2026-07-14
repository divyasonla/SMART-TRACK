import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, Sparkles, CheckCircle2, AlertTriangle, RefreshCcw, AlertCircle } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const GoalSetting = () => {
  // Basic Details States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedCompletionTime, setExpectedCompletionTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');

  // UI Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // 'valid' | 'invalid' | null
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const priorityOptions = [
    { label: 'High Priority', value: 'High' },
    { label: 'Medium Priority', value: 'Medium' },
    { label: 'Low Priority', value: 'Low' },
  ];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExpectedCompletionTime('');
    setDeadline('');
    setPriority('');
  };

  /**
   * Submit the goal as active (status: 'In Progress') after AI check.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);
    setIsModalOpen(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Simulate AI validation delay
    setTimeout(async () => {
      setIsValidating(false);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            expectedCompletionTime: Number(expectedCompletionTime),
            deadline,
            priority,
            status: 'In Progress',
          }),
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || 'Failed to submit goal.');
        }

        setValidationResult('valid');
        setSuccessMsg('Goal submitted and approved successfully!');
        resetForm();
      } catch (err) {
        setValidationResult('invalid');
        setErrorMsg(err.message || 'Failed to submit goal.');
      }
    }, 1500);
  };

  /**
   * Save the goal as a draft (status: 'Draft').
   */
  const handleSaveDraft = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title || !description || !expectedCompletionTime || !deadline || !priority) {
      setErrorMsg('Please fill in all details to save a draft.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          expectedCompletionTime: Number(expectedCompletionTime),
          deadline,
          priority,
          status: 'Draft',
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to save draft.');
      }

      setSuccessMsg('Goal draft saved successfully!');
      resetForm();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save draft.');
    } finally {
      setLoading(false);
    }
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

      {/* Success Notification */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 text-green-700 font-medium"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-600"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <Card className="shadow-xl">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Goal Details</h2>
              <Input
                label="Goal Title"
                placeholder="E.g., Complete Advanced React Course"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
              
              <div className="flex flex-col mb-4">
                <label className="mb-2 text-sm font-medium text-slate-700">Goal Description</label>
                <textarea
                  className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 min-h-[120px]"
                  placeholder="Describe your goal in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Expected Completion Time (hours)"
                  placeholder="e.g. 40"
                  type="number"
                  value={expectedCompletionTime}
                  onChange={(e) => setExpectedCompletionTime(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  disabled={loading}
                />
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  disabled={loading}
                  defaultValue=""
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                icon={Save}
                onClick={handleSaveDraft}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                type="button"
                variant="outline"
                icon={RefreshCcw}
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={Send}
                disabled={loading}
              >
                Submit Goal
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Validation Result Modal */}
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
              <p className="text-slate-600 mb-8">Your goal follows the SMART framework and has been saved to your dashboard!</p>
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
                <p>{errorMsg || 'Your goal lacks a specific measurement for success. Try adding a concrete metric, like completing modules or projects.'}</p>
              </div>

              <div className="flex gap-4 w-full">
                <Button onClick={() => setIsModalOpen(false)} variant="outline" fullWidth>
                  Edit Goal
                </Button>
                <Button variant="primary" fullWidth icon={Sparkles} onClick={() => setIsModalOpen(false)}>
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
