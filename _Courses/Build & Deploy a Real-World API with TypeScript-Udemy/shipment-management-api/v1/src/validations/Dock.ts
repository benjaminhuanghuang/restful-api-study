import Joi from "joi";

const create = Joi.object({
  name: Joi.string().trim().max(128).required(),
  purpose: Joi.string().trim().max(128).optional().allow(""),
  comment: Joi.string().trim().max(512).optional().allow(""),
  availability: Joi.boolean().optional().default(true),
  status: Joi.boolean().optional().default(true),
  deleted: Joi.boolean().optional().default(false),
});

const update = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().max(128).required(),
  purpose: Joi.string().trim().max(128).optional().allow(""),
  comment: Joi.string().trim().max(512).optional().allow(""),
  availability: Joi.boolean().optional().default(true),
  status: Joi.boolean().optional().default(true),
  deleted: Joi.boolean().optional().default(false),
});

export default { create, update };
