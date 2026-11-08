const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const FAQ = require('../models/FAQ');
const Helpline = require('../models/Helpline');
const seedData = require('./seedData');
const memoryStore = require('./memoryStore');

const seedDatabase = async () => {
  console.log('[Seeder] Starting database seeding...');
  const conn = await connectDB();

  if (conn) {
    try {
      console.log('[Seeder] Connected to MongoDB. Clearing existing collections...');
      await User.deleteMany({});
      await Scheme.deleteMany({});
      await FAQ.deleteMany({});
      await Helpline.deleteMany({});

      console.log('[Seeder] Inserting Users...');
      for (const u of seedData.users) {
        await User.create(u);
      }

      console.log('[Seeder] Inserting Schemes...');
      await Scheme.insertMany(seedData.schemes);

      console.log('[Seeder] Inserting FAQs...');
      await FAQ.insertMany(seedData.faqs);

      console.log('[Seeder] Inserting Helplines...');
      await Helpline.insertMany(seedData.helplines);

      console.log('[Seeder] Database seeded successfully in MongoDB!');
    } catch (err) {
      console.error('[Seeder Error]', err.message);
    } finally {
      await mongoose.disconnect();
    }
  } else {
    // Populate in-memory store
    console.log('[Seeder] MongoDB not reachable. Seeding in-memory repository...');
    memoryStore.users = seedData.users.map((u, i) => ({ ...u, _id: `user_${i + 1}`, createdAt: new Date() }));
    memoryStore.schemes = seedData.schemes.map((s, i) => ({ ...s, _id: `scheme_${i + 1}`, createdAt: new Date() }));
    memoryStore.faqs = seedData.faqs.map((f, i) => ({ ...f, _id: `faq_${i + 1}`, createdAt: new Date() }));
    memoryStore.helplines = seedData.helplines.map((h, i) => ({ ...h, _id: `helpline_${i + 1}`, createdAt: new Date() }));
    console.log(`[Seeder] In-memory store ready: ${memoryStore.schemes.length} schemes, ${memoryStore.faqs.length} FAQs, ${memoryStore.helplines.length} helplines.`);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('[Seeder] Seeding process complete.');
    process.exit(0);
  });
}

module.exports = seedDatabase;
