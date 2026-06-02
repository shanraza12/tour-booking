const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const res = await mongoose.connection.collection('users').deleteMany({ role: { $nin: ['admin', 'staff'] } });
        console.log('Deleted users:', res.deletedCount);

        // Also delete agency offerings since agencies are deleted
        const res2 = await mongoose.connection.collection('agencyofferings').deleteMany({});
        console.log('Deleted legacy agency offerings:', res2.deletedCount);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
