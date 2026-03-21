import Joi from "joi";

const create = Joi.object({
  user_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "user_id must be a valid ObjectId",
    }),
  pickup_time: Joi.date().optional(),
  loading_time: Joi.string().max(128).optional().allow(""),
  carrier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "carrier must be a valid ObjectId",
    }),
  delivery_date_time: Joi.date().optional(),
  load_code: Joi.string().max(128).optional().allow(""),
  destination: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "destination must be a valid MongoDB ObjectId",
    }),
  references: Joi.array().items(Joi.string().max(256)).required().min(1),
  pallets: Joi.number().integer().min(0).optional(),
  cartons: Joi.number().integer().min(0).optional(),
  kilo: Joi.number().optional(),
  arrival_time: Joi.string().max(128).optional().allow(""),
  departure_time: Joi.string().max(128).optional().allow(""),
  dock: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "dock must be a valid MongoDB ObjectId",
    }),
  status: Joi.number().valid(0, 1, 2, 3).optional().default(0),
  unloading_reference: Joi.string().max(256).optional().allow(""),
  comments: Joi.string().max(1024).optional().allow(""),
  cmr_status: Joi.boolean().optional().default(false),
  pod_status: Joi.boolean().optional().default(false),
  sub_shipments: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([]),
  is_sub_shipment: Joi.boolean().optional().default(false),
});

const update = Joi.object({
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "_id must be a valid ObjectId",
    }),
  pickup_time: Joi.date().optional(),
  loading_time: Joi.string().max(128).optional().allow(""),
  carrier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "carrier must be a valid ObjectId",
    }),
  delivery_date_time: Joi.date().optional(),
  load_code: Joi.string().max(128).optional().allow(""),
  destination: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "destination must be a valid MongoDB ObjectId",
    }),
  references: Joi.array().items(Joi.string().max(256)).required().min(1),
  pallets: Joi.number().integer().min(0).optional(),
  cartons: Joi.number().integer().min(0).optional(),
  kilo: Joi.number().optional(),
  arrival_time: Joi.string().max(128).optional().allow(""),
  departure_time: Joi.string().max(128).optional().allow(""),
  dock: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "dock must be a valid MongoDB ObjectId",
    }),
  status: Joi.number().valid(0, 1, 2, 3).optional().default(0),
  unloading_reference: Joi.string().max(256).optional().allow(""),
  comments: Joi.string().max(1024).optional().allow(""),
  cmr_status: Joi.boolean().optional().default(false),
  pod_status: Joi.boolean().optional().default(false),
  sub_shipments: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([]),
  is_sub_shipment: Joi.boolean().optional().default(false),
});

const addSubShipment = Joi.object({
  references: Joi.array().items(Joi.string().max(256)).optional().min(1),
  pallets: Joi.number().integer().min(0).optional(),
  cartons: Joi.number().integer().min(0).optional(),
  kilo: Joi.number().min(0).optional(),
  comments: Joi.string().max(1024).optional().allow(""),
});

const updateSubShipment = Joi.object({
  references: Joi.array().items(Joi.string().max(256)).optional().min(1),
  pallets: Joi.number().integer().min(0).optional(),
  cartons: Joi.number().integer().min(0).optional(),
  kilo: Joi.number().min(0).optional(),
  comments: Joi.string().max(1024).optional().allow(""),
});

export default { create, update, addSubShipment, updateSubShipment };
