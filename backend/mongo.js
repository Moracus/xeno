import dotenv from "dotenv";
import Customer from "./models/Customer.js";
import mongoose from "mongoose";
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
    spend: 5000,
    visits: 5,
    lastActiveDate: new Date("2023-10-15"),
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9876543210",
    spend: 10000,
    visits: 10,
    lastActiveDate: new Date("2023-10-01"),
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "5678901234",
    spend: 15000,
    visits: 15,
    lastActiveDate: new Date("2023-09-20"),
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "6789012345",
    spend: 8000,
    visits: 8,
    lastActiveDate: new Date("2023-09-25"),
  },
];

const insertSeedCustomers = async () => {
  try {
    await Customer.insertMany(seedCustomers);
    console.log("data inserted successfully");
  } catch (error) {
    console.log(error);
  }
};
insertSeedCustomers();
