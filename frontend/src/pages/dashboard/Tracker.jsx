import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Mic, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';

// Dummy Data for July 2026 (Starts on Wednesday, 31 days)
// Adding empty days for padding to align with weekday headers (Sun-Sat)
const generateMockCalendarData = () => {
  const days = [];
  
  // Padding for Sun, Mon, Tue (July 2026 starts on Wed)
  for(let i=0; i<3; i++) {
    days.push({ id: `empty-start-${i}`, isPadding: true });
  }

  // Actual days in July
  for(let i=1; i<=31; i++) {
    const dayData = {
      id: `day-${i}`,
      isPadding: false,
      date: i,
      fullDate: `July ${i}, 2026`,
      dayOfWeek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][(i + 2) % 7],
      
      // Inject dummy data for specific days to demonstrate UI
      goal: [12, 13, 14, 15, 16, 19].includes(i) ? `Mock Goal for Day ${i}` : null,
      goalDesc: [12, 13, 14, 15, 16, 19].includes(i) ? "Detailed description of the goal goes here. Complete the specific tasks assigned for today to stay on track." : null,
      goalTime: [12, 13, 14, 15, 16, 19].includes(i) ? "8h" : null,
      goalPriority: [12, 13, 14, 15, 16, 19].includes(i) ? "High" : null,
      goalStatus: [13, 14, 16].includes(i) ? 'success' : [12, 15, 19].includes(i) ? 'warning' : null,
      
      reflection: [12, 13, 14, 15, 16, 19].includes(i) ? `Reflection for day ${i}. It was a highly productive day, but I need to focus more on my weak areas tomorrow.` : null,
    };
    days.push(dayData);
  }

  // Padding for end of month (Ends on Friday, so 1 empty block for Saturday to complete 35 blocks)
  days.push({ id: `empty-end-1`, isPadding: true });

  return days;
};

const calendarDays = generateMockCalendarData();
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const Tracker = () => {
  const [currentMonth, setCurrentMonth] = useState("July 2026");
  const [selectedDay, setSelectedDay] = useState(null);

  const handlePrevMonth = () => setCurrentMonth("June 2026");
  const handleNextMonth = () => setCurrentMonth("August 2026");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10 max-w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Activity Dashboard</h1>
          <p className="text-slate-500 mt-1">Select a date on the calendar to review goals and reflections.</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-slate-700 min-w-[120px] justify-center">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            {currentMonth}
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Monthly Calendar Grid */}
      <div className="w-full">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map(day => (
            <div key={day} className="py-2 text-center text-xs font-black text-slate-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-slate-100/50">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((day) => {
            if (day.isPadding) {
              return <div key={day.id} className="min-h-[120px] bg-transparent"></div>;
            }

            const hasData = day.goal || day.reflection;

            return (
              <motion.div 
                key={day.id} 
                onClick={() => setSelectedDay(day)}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`min-h-[120px] p-3 flex flex-col group cursor-pointer transition-all duration-300 relative rounded-2xl border 
                  ${hasData 
                    ? 'bg-white shadow-xl shadow-blue-900/5 border-blue-100 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-300' 
                    : 'bg-white/80 shadow-md border-slate-100 hover:bg-white hover:shadow-lg'
                  }`}
              >
                {/* 3D Top highlight for premium feel */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rounded-t-2xl"></div>

                <span className={`text-xl font-black transition-colors ${hasData ? 'text-slate-800' : 'text-slate-400'}`}>
                  {day.date}
                </span>

                {/* Indicators Area */}
                <div className="mt-auto flex flex-col gap-1.5 pt-2">
                  {day.goal && (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100/50 rounded-lg p-1.5 group-hover:bg-blue-100 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-700 hidden lg:block uppercase tracking-wider">Goal</span>
                      </div>
                      {day.goalStatus === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                      )}
                    </div>
                  )}

                  {day.reflection && (
                    <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-100/50 rounded-lg p-1.5 group-hover:bg-purple-100 transition-colors">
                      <Mic className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-[10px] font-bold text-purple-700 hidden lg:block uppercase tracking-wider">Reflection</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed View Modal (Remains the same as before) */}
      <AnimatePresence>
        {selectedDay && !selectedDay.isPadding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedDay(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="bg-slate-800 p-6 text-white flex justify-between items-center relative overflow-hidden">
                {/* Decorative shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-black flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-blue-400" />
                    {selectedDay.fullDate}
                  </h2>
                  <p className="text-slate-300 font-medium text-sm mt-1 uppercase tracking-widest">{selectedDay.dayOfWeek}</p>
                </div>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="p-2 hover:bg-slate-700 rounded-full transition-colors relative z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-8 bg-slate-50">
                {/* Goal Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">SMART Goal</h3>
                  </div>
                  
                  {selectedDay.goal ? (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> VERIFIED
                       </div>
                      <div className="flex justify-between items-start mb-3 pr-16">
                        <h4 className="text-xl font-bold text-slate-900">{selectedDay.goal}</h4>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mb-4">
                        {selectedDay.goalStatus === 'success' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Achieved</span>
                        ) : (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full inline-flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> Needs Attention</span>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">{selectedDay.goalDesc}</p>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {selectedDay.goalTime}</span>
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md uppercase tracking-wider">{selectedDay.goalPriority} Priority</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 border-dashed text-center">
                      <p className="text-slate-400 italic">No goal was recorded on this day.</p>
                    </div>
                  )}
                </section>

                {/* Reflection Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Audio Reflection</h3>
                  </div>

                  {selectedDay.reflection ? (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm relative">
                      <Mic className="w-24 h-24 absolute right-4 bottom-4 text-purple-200/50" />
                      <p className="text-slate-700 leading-relaxed relative z-10 text-base font-medium italic">"{selectedDay.reflection}"</p>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 border-dashed text-center">
                      <p className="text-slate-400 italic">No reflection was recorded on this day.</p>
                    </div>
                  )}
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
