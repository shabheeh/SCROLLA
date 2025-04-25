import { celebrate, Joi, Segments } from "celebrate";

export const validateUserSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .required(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    dob: Joi.date().iso().less("now").required(),
    preferences: Joi.alternatives()
      .try(Joi.array().items(Joi.string()).min(1), Joi.string())
      .custom((value) =>
        typeof value === "string" ? JSON.parse(value) : value
      ),
  }),
});

export const validateUserSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
