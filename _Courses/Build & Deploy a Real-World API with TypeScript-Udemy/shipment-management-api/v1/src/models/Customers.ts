import Mongoose from "mongoose";

const CustomerSchema = new Mongoose.Schema(
  {
    address_1: {},
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

CustomerSchema.index(
  { user_id: 1, deleted: 1, createdAt: -1 },
  { partialFilterExpression: { deleted: false } },
);
CustomerSchema.index(
  { user_id: 1, name: 1 },
  { unique: true, partialFilterExpression: { deleted: false } },
);

CustomerSchema.index(
  { user_id: 1, deleted: 1, status: 1, createdAt: -1 },
  { partialFilterExpression: { deleted: false } },
);

CustomerSchema.index(
  { user_id: 1, deleted: 1, country: 1, createdAt: -1 },
  { partialFilterExpression: { deleted: false } },
);

export default Mongoose.model("customer", CustomerSchema);
