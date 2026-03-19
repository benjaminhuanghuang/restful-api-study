import Mongoose from "mongoose";

const CarrierSchema = new Mongoose.Schema(
  {
    user_id: {
      type: Mongoose.Schema.Types.ObjectId, // Reference
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      maxLength: 128,
      required: true,
    },
    contact_person: {
      type: String,
      maxLength: 48,
    },
    contact_phone: {
      type: String,
      maxLength: 12,
    },
    contact_email: {
      type: String,
      maxLength: 128,
    },
    address_1: {
      type: String,
      maxLength: 128,
    },
    address_2: {
      type: String,
      maxLength: 128,
    },
    address_3: {
      type: String,
      maxLength: 128,
    },
    country: {
      type: String,
      maxLength: 128,
    },
    comment: {
      type: String,
      maxLength: 512,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

CarrierSchema.index(
  { user_id: 1, createdAt: -1 },
  { partialFilterExpression: { deleted: false } },
);

CarrierSchema.index(
  { user_id: 1, name: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

export default Mongoose.model("carrier", CarrierSchema);
