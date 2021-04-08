const appError = require('./appError')
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)



module.exports.signUpValidators = joi.object({
    familyName: joi.string().required().escapeHTML(),
    Name: joi.string().required().escapeHTML(),
    username: joi.string().required().escapeHTML(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'de'] } }).required().escapeHTML(),
    password: joi.string().required().escapeHTML(),
    imgSrc: joi.string().required(),
}).required()


module.exports.loginValidators = joi.object({
    username: joi.string().required().escapeHTML(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'de'] } }).required().escapeHTML(),
    password: joi.string().required().escapeHTML(),
}).required()

module.exports.feedbackValidators = joi.object({
    username: joi.string().required().escapeHTML(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'de'] } }).required().escapeHTML(),
    userJob: joi.string().required().escapeHTML(),
    feedbackText: joi.string().required().escapeHTML(),
    userSatisfied: joi.string().required().escapeHTML(),
    websiteProblem: joi.string().required().escapeHTML(),
}).required()


module.exports.signOutValidators = joi.object({
    username: joi.string().required().escapeHTML(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'de'] } }).required().escapeHTML(),
}).required()


module.exports.validationFn = (data, validationSchema) => {
    let { error } = validationSchema.validate(data);
    if (error) {
        throw new appError(error, 400);
    }
}