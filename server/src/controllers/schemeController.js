const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const memoryStore = require('../utils/memoryStore');
const seedData = require('../utils/seedData');

// Ensure seed data in memoryStore if empty
const ensureMemoryData = () => {
  if (memoryStore.schemes.length === 0) {
    memoryStore.schemes = seedData.schemes.map((s, idx) => ({
      ...s,
      _id: `scheme_${idx + 1}`,
      createdAt: new Date(),
    }));
  }
};

// @desc    Get all schemes with search, category, and state filtering
// @route   GET /api/schemes
// @access  Public
const getSchemes = async (req, res, next) => {
  try {
    const { q, category, state, page = 1, limit = 10, lang = 'mr' } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (state && state !== 'All India') {
        query.$or = [{ state: 'All India' }, { state: state }];
      }

      if (q) {
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
          { governmentDepartment: { $regex: q, $options: 'i' } },
        ];
      }

      const total = await Scheme.countDocuments(query);
      const schemes = await Scheme.find(query)
        .sort({ lastVerifiedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      res.status(200).json({
        success: true,
        count: schemes.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        schemes,
      });
    } else {
      // Memory Store fallback
      ensureMemoryData();
      let filtered = [...memoryStore.schemes];

      if (category && category !== 'All') {
        filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }

      if (state && state !== 'All India') {
        filtered = filtered.filter((s) => s.state === 'All India' || s.state === state);
      }

      if (q) {
        const queryTerm = q.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(queryTerm) ||
            s.description.toLowerCase().includes(queryTerm) ||
            (s.tags && s.tags.some((t) => t.toLowerCase().includes(queryTerm))) ||
            s.governmentDepartment.toLowerCase().includes(queryTerm)
        );
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + Number(limit));

      res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: Number(page),
        schemes: paginated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scheme by ID or slug
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let scheme;
      if (mongoose.Types.ObjectId.isValid(id)) {
        scheme = await Scheme.findById(id);
      } else {
        scheme = await Scheme.findOne({ slug: id });
      }

      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Government scheme not found.' });
      }

      res.status(200).json({ success: true, scheme });
    } else {
      ensureMemoryData();
      const scheme = memoryStore.schemes.find((s) => s._id === id || s.slug === id);

      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Government scheme not found.' });
      }

      res.status(200).json({ success: true, scheme });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new scheme (Admin only)
// @route   POST /api/schemes
// @access  Private (Admin)
const createScheme = async (req, res, next) => {
  try {
    const schemeData = req.body;
    if (!schemeData.name || !schemeData.description || !schemeData.category || !schemeData.officialUrl) {
      return res.status(400).json({
        success: false,
        message: 'Scheme name, description, category, and official URL are required.',
      });
    }

    if (!schemeData.slug) {
      schemeData.slug = schemeData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (mongoose.connection.readyState === 1) {
      const scheme = await Scheme.create(schemeData);
      res.status(201).json({ success: true, message: 'Scheme published successfully.', scheme });
    } else {
      ensureMemoryData();
      const newScheme = {
        ...schemeData,
        _id: `scheme_${Date.now()}`,
        lastVerifiedAt: new Date(),
        createdAt: new Date(),
      };
      memoryStore.schemes.unshift(newScheme);
      res.status(201).json({ success: true, message: 'Scheme published successfully.', scheme: newScheme });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update scheme (Admin only)
// @route   PUT /api/schemes/:id
// @access  Private (Admin)
const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const scheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Scheme not found.' });
      }
      res.status(200).json({ success: true, message: 'Scheme updated successfully.', scheme });
    } else {
      ensureMemoryData();
      const idx = memoryStore.schemes.findIndex((s) => s._id === id || s.slug === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Scheme not found.' });
      }
      memoryStore.schemes[idx] = { ...memoryStore.schemes[idx], ...req.body, lastVerifiedAt: new Date() };
      res.status(200).json({ success: true, message: 'Scheme updated successfully.', scheme: memoryStore.schemes[idx] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete scheme (Admin only)
// @route   DELETE /api/schemes/:id
// @access  Private (Admin)
const deleteScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const scheme = await Scheme.findByIdAndDelete(id);
      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Scheme not found.' });
      }
      res.status(200).json({ success: true, message: 'Scheme removed successfully.' });
    } else {
      ensureMemoryData();
      const initialLen = memoryStore.schemes.length;
      memoryStore.schemes = memoryStore.schemes.filter((s) => s._id !== id && s.slug !== id);
      if (memoryStore.schemes.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Scheme not found.' });
      }
      res.status(200).json({ success: true, message: 'Scheme removed successfully.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get category counts
// @route   GET /api/schemes/categories/summary
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Agriculture',
      'Education',
      'Healthcare',
      'Women Empowerment',
      'Employment',
      'Housing',
      'Financial Assistance',
      'Social Welfare',
      'Rural Development',
    ];

    let counts = {};
    if (mongoose.connection.readyState === 1) {
      const agg = await Scheme.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      agg.forEach((a) => { counts[a._id] = a.count; });
    } else {
      ensureMemoryData();
      categories.forEach((cat) => {
        counts[cat] = memoryStore.schemes.filter((s) => s.category === cat).length;
      });
    }

    const summary = categories.map((cat) => ({
      name: cat,
      count: counts[cat] || 0,
    }));

    res.status(200).json({ success: true, categories: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getCategories,
};
