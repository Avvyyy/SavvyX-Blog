import Joi from "joi";

const createPostValidation = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().min(10).required()
})

const upatePostValidation = Joi.object({
    title: Joi.string(),
    content: Joi.string().min(10)
})

export { createPostValidation, upatePostValidation }