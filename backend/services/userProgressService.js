// const path = require('path');
// const userProgressRepository = require('../repositories/userProgressRepository');
// const AppError = require('../utils/appError');
// const Task = require('../models/taskModel');

// // Load static phasedata.json reference
// const phasesFilePath = path.join(__dirname, '../phasedata.json');
// let staticPhases = [];
// try {
//   staticPhases = JSON.parse(fs.readFileSync(phasesFilePath, 'utf8'));
// } catch (err) {
//   console.error('Failed to read phasedata.json:', err);
// }

// // Helper to compute phase status and progress
// const getPhaseProgress = (phaseNum, completedPhases, currentPhase) => {
//   if (completedPhases.includes(phaseNum)) return { status: 'Completed', progress: 100 };
//   if (phaseNum < currentPhase) return { status: 'Completed', progress: 100 };
//   if (phaseNum === currentPhase) return { status: 'In Progress', progress: 0 };
//   return { status: 'Locked', progress: 0 };
// };

// class UserProgressService {
//   /**
//    * Get all phases along with the user's unlock & completion status.
//    * @param {string} userId - User ID
//    * @returns {Promise<Array>} Array of phases with computed status and progress
//    */
//   async getPhasesWithStatus(userId) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);
//     const { currentPhase, completedPhases } = progress;

//     return staticPhases.map((phase) => {
//       const phaseNum = phase.phase;
//       const { status, progress: progressPct } = getPhaseProgress(phaseNum, completedPhases, currentPhase);
//       // Determine if this phase can be unlocked (used for UI)
//       const isUnlockable =
//         !completedPhases.includes(phaseNum) &&
//         phaseNum === currentPhase &&
//         this.isPhaseUnlockable(userId, phaseNum);

//       return {
//         id: phaseNum,
//         number: phaseNum,
//         name: phase.title,
//         timeline: phase.timeline,
//         concepts: phase.learning_concept,
//         overcome: phase.learning_outcome,
//         progress: progressPct,
//         status,
//         isUnlockable,
//       };
//     });
//   }

//   /**
//    * Determine if a given phase can be unlocked based on goals completion and deadline.
//    * @param {string} userId - User ID
//    * @param {number} phaseNumber - Phase number to evaluate
//    * @returns {Promise<boolean>} True if unlockable
//    */
//   async isPhaseUnlockable(userId, phaseNumber) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);
//     // Find start date for this phase
//     const phaseDetail = progress.phaseDetails.find((d) => d.phase === phaseNumber);
//     if (!phaseDetail) return false;
//     const startDate = new Date(phaseDetail.startDate);
//     // Find phase metadata for timeline
//     const phaseMeta = staticPhases.find((p) => p.phase === phaseNumber);
//     if (!phaseMeta) return false;
//     // Parse timeline (e.g., "5 days")
//     const timelineMatch = phaseMeta.timeline.match(/(\d+)\s*(day|days|hour|hours|minute|minutes)/i);
//     let requiredMs = 0;
//     if (timelineMatch) {
//       const value = parseInt(timelineMatch[1], 10);
//       const unit = timelineMatch[2].toLowerCase();
//       if (unit.startsWith('day')) requiredMs = value * 24 * 60 * 60 * 1000;
//       else if (unit.startsWith('hour')) requiredMs = value * 60 * 60 * 1000;
//       else if (unit.startsWith('minute')) requiredMs = value * 60 * 1000;
//     }
//     // Deadline must have passed
//     if (Date.now() - startDate.getTime() < requiredMs) return false;
//     // All tasks for this phase must be completed
//     const tasks = await Task.find({ user: userId, phase: phaseNumber });
//     if (tasks.length === 0) return false;
//     return tasks.every((t) => t.completed === true);
//   }

//   /**
//    * Mark a specific phase as completed, automatically unlocking the next phase.
//    * @param {string} userId - User ID
//    * @param {number} phaseNumber - Phase number to complete
//    * @returns {Promise<Object>} The updated progress document
//    */
//   async completePhase(userId, phaseNumber) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);

//     // If already completed, return progress
//     if (progress.completedPhases.includes(phaseNumber)) {
//       return progress;
//     }

//     if (phaseNumber !== progress.currentPhase) {
//       throw new AppError(`You cannot complete Phase ${phaseNumber}. Your current active phase is Phase ${progress.currentPhase}.`, 400);
//     }

//     // Verify unlock conditions
//     const unlockable = await this.isPhaseUnlockable(userId, phaseNumber);
//     if (!unlockable) {
//       throw new AppError('Phase cannot be completed yet. Ensure all goals are completed and the deadline has passed.', 400);
//     }

//     // Mark as completed
//     progress.completedPhases.push(phaseNumber);

//     // Unlock next phase
//     const maxPhases = staticPhases.length > 0 ? staticPhases[staticPhases.length - 1].phase : 7;
//     if (progress.currentPhase < maxPhases) {
//       progress.currentPhase += 1;
//       // Record start date for the new phase if not present
//       if (!progress.phaseDetails.find((d) => d.phase === progress.currentPhase)) {
//         progress.phaseDetails.push({ phase: progress.currentPhase, startDate: new Date() });
//       }
//     }

//     return await userProgressRepository.saveProgress(progress);
//   }

//   /**
//    * Get the user's currently active (unlocked but not completed) phase.
//    * @param {string} userId - User ID
//    * @returns {Promise<Object>} The phase metadata
//    */
//   async getCurrentActivePhase(userId) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);
//     const activePhaseNum = progress.currentPhase;

//     const phaseMeta = staticPhases.find((p) => p.phase === activePhaseNum);
//     if (!phaseMeta) {
//       throw new AppError(`Phase ${activePhaseNum} not found in reference data.`, 404);
//     }

//     return {
//       id: activePhaseNum,
//       number: activePhaseNum,
//       name: phaseMeta.title,
//       timeline: phaseMeta.timeline,
//       concepts: phaseMeta.learning_concept,
//       overcome: phaseMeta.learning_outcome,
//       status: 'In Progress',
//       progress: 0,
//     };
//   }
// }

// module.exports = new UserProgressService();

// // const fs = require('fs');
// // const userProgressRepository = require('../repositories/userProgressRepository');
// // const AppError = require('../utils/appError');

// // Load static phasedata.json reference
// const phasesFilePath = path.join(__dirname, '../phasedata.json');
// let staticPhases = [];
// try {
//   staticPhases = JSON.parse(fs.readFileSync(phasesFilePath, 'utf8'));
// } catch (err) {
//   console.error('Failed to read phasedata.json:', err);
// }

// const getPhaseProgress = (phaseNum, completedPhases, currentPhase) => {
//   if (completedPhases.includes(phaseNum)) return { status: 'Completed', progress: 100 };
//   if (phaseNum < currentPhase) return { status: 'Completed', progress: 100 };
//   if (phaseNum === currentPhase) return { status: 'In Progress', progress: 0 };
//   return { status: 'Locked', progress: 0 };
// };

// class UserProgressService {
//   /**
//    * Get all phases along with the user's unlock & completion status.
//    * @param {string} userId - User ID
//    * @returns {Promise<Array>} Array of phases with computed status and progress
//    */
//   async getPhasesWithStatus(userId) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);
//     const { currentPhase, completedPhases } = progress;

//     return staticPhases.map((phase) => {
//       const phaseNum = phase.phase;
//       const { status, progress: progressPct } = getPhaseProgress(phaseNum, completedPhases, currentPhase);

//       return {
//         id: phaseNum,
//         number: phaseNum,
//         name: phase.title,
//         timeline: phase.timeline,
//         concepts: phase.learning_concept,
//         overcome: phase.learning_outcome,
//         progress: progressPct,
//         status: status,
//       };
//     });
//   }

//   /**
//    * Mark a specific phase as completed, automatically unlocking the next phase.
//    * @param {string} userId - User ID
//    * @param {number} phaseNumber - Phase number to complete
//    * @returns {Promise<Object>} The updated progress document
//    */
//   async completePhase(userId, phaseNumber) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);

//     // If already completed, just return progress
//     if (progress.completedPhases.includes(phaseNumber)) {
//       return progress;
//     }

//     if (phaseNumber !== progress.currentPhase) {
//       throw new AppError(`You cannot complete Phase ${phaseNumber}. Your current active phase is Phase ${progress.currentPhase}.`, 400);
//     }

//     // Mark as completed
//     progress.completedPhases.push(phaseNumber);

//     // Unlock the next phase automatically by incrementing currentPhase
//     // Cap currentPhase to the maximum available phases
//     const maxPhases = staticPhases.length > 0 ? staticPhases[staticPhases.length - 1].phase : 7;
//     if (progress.currentPhase < maxPhases) {
//       progress.currentPhase += 1;
//     }

//     return await userProgressRepository.saveProgress(progress);
//   }

//   /**
//    * Get the user's currently active (unlocked but not completed) phase.
//    * @param {string} userId - User ID
//    * @returns {Promise<Object>} The phase metadata
//    */
//   async getCurrentActivePhase(userId) {
//     const progress = await userProgressRepository.findOrCreateProgress(userId);
//     const activePhaseNum = progress.currentPhase;

//     const phaseMeta = staticPhases.find((p) => p.phase === activePhaseNum);
//     if (!phaseMeta) {
//       throw new AppError(`Phase ${activePhaseNum} not found in reference data.`, 404);
//     }

//     return {
//       id: activePhaseNum,
//       number: activePhaseNum,
//       name: phaseMeta.title,
//       timeline: phaseMeta.timeline,
//       concepts: phaseMeta.learning_concept,
//       overcome: phaseMeta.learning_outcome,
//       status: 'In Progress',
//       progress: 0,
//     };
//   }
// }

// module.exports = new UserProgressService();
