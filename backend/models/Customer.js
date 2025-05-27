import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    spend: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
  },
  { timestamps: true }
);
const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
