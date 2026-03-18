import Mongoose, { Schema } from "mongoose";

const BillingInformationSchema = new Schema(
  {
    company_name: { type: String, maxLength: 128, required: true },
    registration_tax_id: { type: String, maxLength: 48, required: true },
    vat_number: { type: String, maxLength: 48 },
    billing_email: { type: String, maxLength: 128, required: true },
    contact_name: { type: String, maxLength: 128, required: true },
    phone_number: { type: String, maxLength: 20 },
    billing_address: { type: String, maxLength: 256, required: true },
    city: { type: String, maxLength: 128, required: true },
    state_province: { type: String, maxLength: 128 },
    country: { type: String, maxLength: 128, required: true },
    postcode: { type: String, maxLength: 48, required: true },
  },
  { _id: false },
);

export default BillingInformationSchema;
