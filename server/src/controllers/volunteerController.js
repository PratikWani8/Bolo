const AssistedQuery = require('../models/AssistedQuery');
const memoryStore = require('../utils/memoryStore');
const mongoose = require('mongoose');

const createAssistedQuery = async (req, res, next) => {
  try {
    const { citizenReference, question, language, schemeId, schemeName, notes, status } = req.body;
    const volunteerId = req.user._id;

    if (!citizenReference || !question) {
      return res.status(400).json({
        success: false,
        message: 'Citizen reference (e.g. name/location) and question are required.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const record = await AssistedQuery.create({
        volunteerId,
        citizenReference,
        question,
        language: language || 'mr',
        schemeId: schemeId || null,
        schemeName: schemeName || '',
        notes: notes || '',
        status: status || 'resolved',
      });
      return res.status(201).json({ success: true, message: 'Assistance record saved', record });
    }

    const newRecord = {
      _id: `assist_${Date.now()}`,
      volunteerId,
      citizenReference,
      question,
      language: language || 'mr',
      schemeId: schemeId || null,
      schemeName: schemeName || '',
      notes: notes || '',
      status: status || 'resolved',
      createdAt: new Date(),
    };
    memoryStore.assistedQueries.unshift(newRecord);
    res.status(201).json({ success: true, message: 'Assistance record saved', record: newRecord });
  } catch (error) {
    next(error);
  }
};

const getAssistedQueries = async (req, res, next) => {
  try {
    const volunteerId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (mongoose.connection.readyState === 1) {
      const query = isAdmin ? {} : { volunteerId };
      const records = await AssistedQuery.find(query)
        .populate('schemeId', 'name category officialUrl')
        .sort({ createdAt: -1 })
        .limit(50);
      return res.status(200).json({ success: true, count: records.length, records });
    }

    const list = isAdmin
      ? memoryStore.assistedQueries
      : memoryStore.assistedQueries.filter((q) => String(q.volunteerId) === String(volunteerId));
    res.status(200).json({ success: true, count: list.length, records: list });
  } catch (error) {
    next(error);
  }
};

const getVolunteerStats = async (req, res, next) => {
  try {
    const volunteerId = req.user._id;
    let total = 0;
    let resolved = 0;
    let pending = 0;

    if (mongoose.connection.readyState === 1) {
      total = await AssistedQuery.countDocuments({ volunteerId });
      resolved = await AssistedQuery.countDocuments({ volunteerId, status: 'resolved' });
      pending = await AssistedQuery.countDocuments({ volunteerId, status: 'pending_followup' });
    } else {
      const myQueries = memoryStore.assistedQueries.filter((q) => String(q.volunteerId) === String(volunteerId));
      total = myQueries.length;
      resolved = myQueries.filter((q) => q.status === 'resolved').length;
      pending = myQueries.filter((q) => q.status === 'pending_followup').length;
    }

    res.status(200).json({
      success: true,
      stats: {
        totalQueries: total,
        resolvedQueries: resolved,
        pendingQueries: pending,
        satisfactionRate: total > 0 ? Math.round((resolved / total) * 100) : 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssistedQuery,
  getAssistedQueries,
  getVolunteerStats,
};
