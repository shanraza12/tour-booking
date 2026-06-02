import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}).limit(5);
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role}) ID: ${u._id}`));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkUsers();
