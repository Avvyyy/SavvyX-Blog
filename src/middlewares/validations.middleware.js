export const validateSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            data: {},
            message: error.details[0].message
        })
    }

    next();
}