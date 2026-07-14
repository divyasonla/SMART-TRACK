const Phase = require('../models/Phase');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Service layer for Phase CRUD operations.
 * All database logic lives here — controllers stay thin.
 */
class PhaseService {
  /**
   * Create a new curriculum phase.
   * @param {Object} data - Phase fields from request body
   * @returns {Promise<Object>} - The created phase document
   */
  async createPhase(data) {
    return await Phase.create(data);
  }

  /**
   * Retrieve all phases, ordered by phaseNumber ascending.
   * @returns {Promise<Array>} - List of phase documents
   */
  async getAllPhases() {
    return await Phase.find().sort({ phaseNumber: 1 });
  }

  /**
   * Retrieve a single phase by its MongoDB _id.
   * @param {string} id - The phase's ObjectId
   * @returns {Promise<Object>} - The found phase document
   */
  async getPhaseById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Phase ID format.', 400);
    }

    const phase = await Phase.findById(id);
    if (!phase) {
      throw new AppError(`Phase with ID ${id} not found.`, 404);
    }
    return phase;
  }

  /**
   * Update a phase by ID.
   * @param {string} id - The phase's ObjectId
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - The updated phase document
   */
  async updatePhase(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Phase ID format.', 400);
    }

    const phase = await Phase.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!phase) {
      throw new AppError(`Phase with ID ${id} not found.`, 404);
    }
    return phase;
  }

  /**
   * Delete a phase by ID.
   * @param {string} id - The phase's ObjectId
   * @returns {Promise<Object>} - The deleted phase document
   */
  async deletePhase(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Phase ID format.', 400);
    }

    const phase = await Phase.findByIdAndDelete(id);
    if (!phase) {
      throw new AppError(`Phase with ID ${id} not found.`, 404);
    }
    return phase;
  }
}

module.exports = new PhaseService();
