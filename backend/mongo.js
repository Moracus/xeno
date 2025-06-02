import dotenv from "dotenv";
import Customer from "./models/Customer.js";
import mongoose from "mongoose";
import Order from "./models/Order.js";
dotenv.config();

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URL, { dbName: "xeno" })
    .then(() => console.log("Monodb connected"))
    .catch((err) => {
      console.error("faled to connect");
      console.error(err);
    });
};
connectDB();

const seedCustomers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    spend: 0,
    visits: 5,
    lastActiveDate: new Date("2023-10-15"),
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9876543210",
    spend: 0,
    visits: 10,
    lastActiveDate: new Date("2023-10-01"),
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "5678901234",
    spend: 0,
    visits: 15,
    lastActiveDate: new Date("2023-09-20"),
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "6789012345",
    spend: 0,
    visits: 8,
    lastActiveDate: new Date("2023-09-25"),
  },
];

const insertSeedCustomers = async () => {
  try {
    await Customer.deleteMany();
    console.log("Existing customer data cleared");
    await Customer.insertMany(seedCustomers);
    console.log("data inserted successfully");
  } catch (error) {
    console.log(error);
  }
};
// insertSeedCustomers();
const insertSeedOrders = async () => {
  try {
    // Fetch all customer IDs
    const customers = await Customer.find();
    if (!customers.length) {
      console.log("No customers found. Seed customer data first.");
      return;
    }
    const orders = [];
    customers.forEach((customer) => {
      // Create random orders for each customer
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        const amount = Math.floor(Math.random() * 5000) + 1000; // Random amount between 1000 and 5000
        orders.push({
          customerId: customer._id,
          amount,
        });
      }
    });
    // Clear existing orders
    await Order.deleteMany();
    console.log("Existing orders cleared");

    // Insert new orders
    const insertedOrders = await Order.insertMany(orders);
    console.log("Orders seeded successfully");
    // Update `spend` field in `Customer` model
    for (const order of insertedOrders) {
      await Customer.findByIdAndUpdate(
        order.customerId,
        { $inc: { spend: order.amount } }, // Increment the spend field
        { new: true }
      );
    }
    console.log("Customer spend fields updated successfully");
  } catch (error) {
    console.error("Error seeding order data:", error);
  }
};
insertSeedOrders();
