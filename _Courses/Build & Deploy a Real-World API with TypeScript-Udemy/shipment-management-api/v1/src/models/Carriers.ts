import Mongoose from "mongoose";

const CarrierSchema = new Mongoose.Schema(
  {
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
