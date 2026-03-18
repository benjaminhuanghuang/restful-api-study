import Mongoose, { Schema } from "mongoose";

import BillingInformationSchema from "./BillingInformation";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 128,
      index: true,
    },
    password: { type: String, required: true, maxLength: 128 },
    company_name: { type: String, maxLength: 128 },
    contact_person: { type: String, maxLength: 128 },
    phone_number: { type: String, maxLength: 12 },
    country_region: { type: String, maxLength: 128 },
    address: { type: String, maxLength: 256 },
    postal_code: { type: String, maxLength: 12 },
    logo_url: { type: String, maxLength: 1024 },
    status: { type: Boolean, default: true },
    billing_information: { type: BillingInformationSchema },
  },
  { timestamps: true, versionKey: false },
);

export default Mongoose.model("User", UserSchema);
