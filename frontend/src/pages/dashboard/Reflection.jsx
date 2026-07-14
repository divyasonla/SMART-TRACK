import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Trash2, Edit3, Send, Clock, Calendar } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockReflectionHistory } from '../../data/mockData';

export const Reflection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    setHasRecording(false);
  };

  const handleStop = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const handleDelete = () => {
    setHasRecording(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Daily Reflection</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Take a moment to reflect on your day. What went well? What could be improved? Express your thoughts to the AI coach.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-xl">
        <CardBody className="p-8 flex flex-col items-center">
          <div className="relative mb-8 mt-4">
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"
              />
            )}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${isRecording ? 'bg-red-100 text-red-500' : 'bg-white text-blue-500 shadow-lg'}`}>
              <Mic className={`w-12 h-12 ${isRecording ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          
          <div className="text-center mb-8 h-8">
            {isRecording ? (
              <p className="text-red-500 font-medium animate-pulse">Recording... 01:23</p>
            ) : hasRecording ? (
              <p className="text-slate-600 font-medium">Recording saved. Length: 01:23</p>
            ) : (
              <p className="text-slate-500">Tap record to start your reflection</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            {!isRecording && !hasRecording && (
              <Button onClick={handleRecord} variant="primary" icon={Mic} className="px-8 rounded-full">
                Record
              </Button>
            )}
            
            {isRecording && (
              <Button onClick={handleStop} variant="danger" icon={Square} className="px-8 rounded-full">
                Stop
              </Button>
            )}

            {hasRecording && (
              <>
                <Button variant="outline" icon={Play} className="rounded-full">Play</Button>
                <Button variant="outline" icon={Edit3} className="rounded-full">Edit Text</Button>
                <Button onClick={handleDelete} variant="ghost" icon={Trash2} className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full">Delete</Button>
                <Button variant="primary" icon={Send} className="rounded-full">Submit</Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="text-center py-6">
        <Button variant="primary" className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
          🎤 Start Reflection Interview
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Reflection History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockReflectionHistory.map((history) => (
            <Card key={history.id} hover>
              <CardBody className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center text-slate-600 text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    {history.date}
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    {history.status}
                  </span>
                </div>
                <div className="flex items-center text-slate-500 text-sm mt-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Time: {history.time} • Duration: {history.duration}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
