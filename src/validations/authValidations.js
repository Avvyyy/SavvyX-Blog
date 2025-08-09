import Joi from "joi";

const getStartedValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^.{8,30}$')).required(),
    email: Joi.string().required().pattern(new RegExp('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.'))
})

const loginValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^.{8,30}$')).required(),
})


export { getStartedValidation, loginValidation }