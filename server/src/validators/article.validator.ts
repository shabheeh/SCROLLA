import { celebrate, Joi, Segments } from "celebrate";

export const validateArticle = celebrate({
  [Segments.BODY]: Joi.object().keys({
    featureImage: Joi.string().optional(),
    title: Joi.string().min(20).max(60).required(),
    subtitle: Joi.string().min(10).max(100).required(),
    content: Joi.string().required(),
    categories: Joi.alternatives()
      .try(Joi.array().items(Joi.string()).min(1), Joi.string())
      .custom((value) =>
        typeof value === "string" ? JSON.parse(value) : value
      ),
    topics: Joi.alternatives()
      .try(Joi.array().items(Joi.string()).min(1), Joi.string())
      .custom((value) =>
        typeof value === "string" ? JSON.parse(value) : value
      ),
    visibility: Joi.string().valid("public", "private").required(),
    isPublished: Joi.boolean().required(),
  }),
});
