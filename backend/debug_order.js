const mongoose = require("mongoose");
const Order = require("./src/models/Order");

async function run() {
    try {
        await mongoose.connect("mongodb+srv://harshsawarn2_db_user:E828v4Dtcl1teE5W@cluster0.b1n2dkw.mongodb.net/testDb2");

        const id = process.argv[2];
        if (id) {
            const order = await Order.findById(id);
            if (!order) {
                console.log("Order not found");
            } else {
                console.log("--- ORDER DETAILS ---");
                console.log(`ID: ${order._id}`);
                console.log(`Status: ${order.status}`);
                console.log(`Delivery OTP: "${order.deliveryOtp}"`);
                console.log(`OTP Verified: ${order.deliveryOtpVerified}`);
                console.log("----------------------");
            }
        } else {
            console.log("Listing last 5 orders:");
            const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
            orders.forEach(o => {
                console.log(`ID: ${o._id} | Status: ${o.status} | OTP: "${o.deliveryOtp}" | Created: ${o.createdAt}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

run();
