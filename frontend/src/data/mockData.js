export const mockUser = {
  name: 'Sheikh',
  email: 'sheikh@example.com',
  campus: 'Dantewada',
  gender: 'Male',
  joiningDate: '2023-08-15',
  currentPhase: 3,
  avatarUrl: 'https://i.pravatar.cc/150?u=sheikh',
  streak: 12,
  interviewScore: 85,
  achievements: ['Early Bird', 'Goal Crusher', 'Perfect Week']
};

export const mockPhases = [
  { id: 1, number: 1, name: 'Onboarding & Foundation', progress: 100, status: 'Completed' },
  { id: 2, number: 2, name: 'Goal Setting Mastery', progress: 100, status: 'Completed' },
  { id: 3, number: 3, name: 'Execution & Consistency', progress: 65, status: 'In Progress' },
  { id: 4, number: 4, name: 'Advanced Strategies', progress: 0, status: 'Locked' },
  { id: 5, number: 5, name: 'Leadership & Influence', progress: 0, status: 'Locked' },
  { id: 6, number: 6, name: 'Peak Performance', progress: 0, status: 'Locked' },
  { id: 7, number: 7, name: 'Mastery & Legacy', progress: 0, status: 'Locked' },
];

export const mockDailyMotivation = "Success is not final, failure is not fatal: it is the courage to continue that counts.";

export const mockReflectionHistory = [
  { id: 1, date: '2026-07-13', time: '21:00', duration: '5:30', status: 'Analyzed' },
  { id: 2, date: '2026-07-12', time: '20:45', duration: '4:15', status: 'Analyzed' },
  { id: 3, date: '2026-07-11', time: '21:30', duration: '6:10', status: 'Analyzed' },
];

export const mockChartData = [
  { name: 'Mon', completed: 3, created: 4 },
  { name: 'Tue', completed: 4, created: 4 },
  { name: 'Wed', completed: 2, created: 2 },
  { name: 'Thu', completed: 5, created: 6 },
  { name: 'Fri', completed: 6, created: 6 },
  { name: 'Sat', completed: 4, created: 5 },
  { name: 'Sun', completed: 5, created: 5 },
];

export const mockAccountability = {
  todayReminder: "Focus on High Priority Tasks.",
  morning: "Plan your day and review your SMART goals.",
  evening: "Submit your daily reflection interview."
};
