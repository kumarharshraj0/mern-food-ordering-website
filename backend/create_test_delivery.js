const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_app';

async function createDeliveryBoy() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'delivery_boy@test.com';
        const existing = await User.findOne({ email });

        if (existing) {
            console.log('Delivery boy already exists. Updating role...');
            existing.roles = ['deliveryBoy'];
            existing.isAvailable = true;
            existing.isVerified = true;
            await existing.save();
            console.log('User updated to delivery boy');
        } else {
            const hashedPassword = await bcrypt.hash('password123', 12);
            const deliveryBoy = new User({
                name: 'Test Delivery Boy',
                email,
                password: hashedPassword,
                roles: ['deliveryBoy'],
                isVerified: true,
                isAvailable: true
            });
            await deliveryBoy.save();
            console.log('Test delivery boy created: delivery_boy@test.com / password123');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createDeliveryBoy();
