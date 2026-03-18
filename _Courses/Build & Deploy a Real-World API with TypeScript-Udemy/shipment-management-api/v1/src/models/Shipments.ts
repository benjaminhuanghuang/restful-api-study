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
      // 16
      type: Number,
    },
    cartons: {
      // 12
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
      required: true,
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
