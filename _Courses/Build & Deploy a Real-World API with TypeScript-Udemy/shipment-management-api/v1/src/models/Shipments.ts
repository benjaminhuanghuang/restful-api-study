import Mongoose, { Schema } from "mongoose";

const ShipmentSchema = new Mongoose.Schema(
  {
    user_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pickup_time: {
      type: Date, // Timestamp for pickup time
    },
    loading_time: {
      type: String, // Timestamp for loading time
      maxLength: 5,
    },
    carrier: {
      type: Mongoose.Schema.Types.ObjectId, // ObjectId reference
      ref: "carrier",
    },
    delivery_date_time: {
      type: Date, // Timestamp for delivery date and time
    },
    load_code: {
      type: String,
      maxLength: 128,
    },
    destination: {
      type: Mongoose.Schema.Types.ObjectId, // ObjectId reference
      ref: "customer",
      required: true,
    },
    references: {
      // ["ref1", "123123123123123123123123123123123123132"]
      type: [String],
      validate: {
        validator: (arr: string[]) => arr.every((ref) => ref.length <= 1024),
        message: "Each reference must be at most 1024 characters long",
      },
      default: [], // optional
    },
    pallets: {
      type: Number,
    },
    cartons: {
      type: Number,
    },
    kilo: {
      type: Number,
    },
    arrival_time: {
      type: String, // Timestamp for loading time
      maxLength: 5,
    },
    departure_time: {
      type: String, // Timestamp for loading
      maxLength: 5,
    },
    dock: {
      type: Schema.Types.ObjectId, // ObjectId reference
      ref: "dock",
      required: function () {
        return !this.is_sub_shipment; // dock is required if it's not a sub-shipment
      },
    },
    status: {
      type: Number, // Only allows 0, 1, 2, 3
      enum: [0, 1, 2, 3], // 0: Confirmed, 1: Ready to ship, 2: Arrived, 3: Shipped
      default: 0,
    },
    unloading_reference: {
      type: String,
      maxLength: 512,
    },
    comments: {
      type: String,
      maxLength: 512,
    },
    cmr_status: {
      type: Boolean, // true or false
      default: false,
    },
    pod_status: {
      type: Boolean, // true or false
      default: false,
    },
    sub_shipments: {
      type: [Schema.Types.ObjectId], // Array of object ids for sub shipments
      ref: "shipment",
      required: false,
    },
    is_sub_shipment: {
      type: Boolean, // true or false
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

ShipmentSchema.index(
  { user_id: 1, is_sub_shipment: 1, createdAt: -1 },
  { partialFilterExpression: { is_sub_shipment: false } },
);

ShipmentSchema.index(
  { user_id: 1, is_sub_shipment: 1, load_code: 1, createdAt: -1 },
  { partialFilterExpression: { is_sub_shipment: false } },
);

ShipmentSchema.index(
  { user_id: 1, is_sub_shipment: 1, cmr_status: 1, createdAt: -1 },
  { partialFilterExpression: { is_sub_shipment: false } },
);

ShipmentSchema.index(
  { user_id: 1, is_sub_shipment: 1, pod_status: 1, createdAt: -1 },
  { partialFilterExpression: { is_sub_shipment: false } },
);

export default Mongoose.model("shipment", ShipmentSchema);
