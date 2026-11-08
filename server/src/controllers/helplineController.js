const Helpline = require('../models/Helpline');
const memoryStore = require('../utils/memoryStore');
const seedData = require('../utils/seedData');
const mongoose = require('mongoose');

const ensureHelplines = () => {
  if (memoryStore.helplines.length === 0) {
    memoryStore.helplines = seedData.helplines.map((h, i) => ({
      ...h,
      _id: `helpline_${i + 1}`,
      createdAt: new Date(),
    }));
  }
};

const getHelplines = async (req, res, next) => {
  try {
    const { state, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (state && state !== 'All India') {
        query.$or = [{ state: 'All India' }, { state }];
      }
      if (search) {
        query.$or = [
          { serviceName: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ];
      }
      const helplines = await Helpline.find(query).sort({ serviceName: 1 });
      return res.status(200).json({ success: true, count: helplines.length, helplines });
    }

    ensureHelplines();
    let list = [...memoryStore.helplines];
    if (state && state !== 'All India') {
      list = list.filter((h) => h.state === 'All India' || h.state === state);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.serviceName.toLowerCase().includes(q) ||
          h.department.toLowerCase().includes(q) ||
          h.phoneNumber.includes(q)
      );
    }

    res.status(200).json({ success: true, count: list.length, helplines: list });
  } catch (error) {
    next(error);
  }
};

const createHelpline = async (req, res, next) => {
  try {
    const { department, serviceName, phoneNumber, officialSource, state, timings, isTollFree } = req.body;

    if (!department || !serviceName || !phoneNumber || !officialSource) {
      return res.status(400).json({
        success: false,
        message: 'Department, service name, phone number, and official source are required.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const helpline = await Helpline.create(req.body);
      return res.status(201).json({ success: true, message: 'Helpline added', helpline });
    }

    ensureHelplines();
    const newHelpline = {
      ...req.body,
      _id: `helpline_${Date.now()}`,
      verificationStatus: 'verified',
      lastVerifiedAt: new Date(),
      createdAt: new Date(),
    };
    memoryStore.helplines.unshift(newHelpline);
    res.status(201).json({ success: true, message: 'Helpline added', helpline: newHelpline });
  } catch (error) {
    next(error);
  }
};

const updateHelpline = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Helpline.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Helpline not found' });
      return res.status(200).json({ success: true, message: 'Helpline updated', helpline: updated });
    }

    ensureHelplines();
    const idx = memoryStore.helplines.findIndex((h) => h._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Helpline not found' });
    memoryStore.helplines[idx] = { ...memoryStore.helplines[idx], ...req.body };
    res.status(200).json({ success: true, message: 'Helpline updated', helpline: memoryStore.helplines[idx] });
  } catch (error) {
    next(error);
  }
};

const deleteHelpline = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Helpline.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Helpline deleted' });
    }

    ensureHelplines();
    memoryStore.helplines = memoryStore.helplines.filter((h) => h._id !== id);
    res.status(200).json({ success: true, message: 'Helpline deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHelplines,
  createHelpline,
  updateHelpline,
  deleteHelpline,
};
