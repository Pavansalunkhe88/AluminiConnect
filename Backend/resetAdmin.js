const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/AlumniPortalDB').then(async () => {
  try {
    const db = mongoose.connection.db;
    const hashed = await bcrypt.hash('Admin@123', 10);
    const result = await db.collection('users').updateOne(
      { email: 'admin@college.edu' },
      { $set: { password: hashed, role: 'admin', prn_number: 'ADMIN-001', name: 'System Administrator' } },
      { upsert: true }
    );
    console.log('Admin password updated in AlumniPortalDB!', result);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
