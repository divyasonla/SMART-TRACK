const fs = require('fs');
const path = require('path');
const Curriculum = require('../models/Curriculum');

/**
 * Utility helper to generate URL-safe slugs from titles.
 * E.g., "Student Profile & Course Portal" -> "student-profile-course-portal"
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/&/g, 'and')           // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple consecutive hyphens with a single one
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '');            // Trim hyphens from end
};

/**
 * Seeds curriculum data from the JSON file to MongoDB, only if the database is currently empty.
 * POST /api/curriculum/seed
 */
exports.seedCurriculum = async (req, res) => {
  try {
    // Check if a curriculum document already exists
    const count = await Curriculum.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Database is already seeded with curriculum data. Seed skipped.'
      });
    }

    // Read the source curriculum.json file
    const filePath = path.join(__dirname, '../data/curriculum.json');
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        status: 'error',
        message: 'Source curriculum.json file not found in backend/data/.'
      });
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dataObj = JSON.parse(rawData);

    // Prepare data (unwrap 'curriculum' root, map 'id', and generate slugs)
    const curriculumData = dataObj.curriculum;
    curriculumData.curriculumId = curriculumData.id;
    delete curriculumData.id;

    if (curriculumData.phases && Array.isArray(curriculumData.phases)) {
      curriculumData.phases = curriculumData.phases.map(phase => ({
        ...phase,
        slug: slugify(phase.title)
      }));
    }

    // Save to database
    const seededCurriculum = await Curriculum.create(curriculumData);

    res.status(201).json({
      status: 'success',
      message: 'Curriculum seeded successfully.',
      data: {
        curriculum: seededCurriculum
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Fetches the entire curriculum document.
 * GET /api/curriculum
 */
exports.getCurriculum = async (req, res) => {
  try {
    const curriculum = await Curriculum.findOne();
    if (!curriculum) {
      return res.status(404).json({
        status: 'fail',
        message: 'Curriculum data not found in the database. Please seed the database first by sending a POST request to /api/curriculum/seed.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        curriculum
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Fetches a specific phase by its unique phase id or generated slug.
 * GET /api/curriculum/:idOrSlug
 */
exports.getPhase = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const curriculum = await Curriculum.findOne();
    if (!curriculum) {
      return res.status(404).json({
        status: 'fail',
        message: 'Curriculum database is empty. Please run seeding first.'
      });
    }

    // Look up the phase matching the id or the URL slug
    const phase = curriculum.phases.find(
      p => p.id === idOrSlug || p.slug === idOrSlug
    );

    if (!phase) {
      return res.status(404).json({
        status: 'fail',
        message: `Phase/module with ID or Slug '${idOrSlug}' not found.`
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        phase
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
