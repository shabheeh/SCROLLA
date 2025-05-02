import express from "express";
import {
  changePassword,
  getRefreshToken,
  getUser,
  updateProfile,
  userSigin,
  userSignout,
  userSignup,
} from "../controllers/user.controller";
import {
  validateUserSignin,
  validateUserSignup,
} from "../validators/user.validator";
import asyncWrapper from "../utils/asyncWrapper";
import { authenticate } from "../middlewares/authMiddleware";
import {
  addArticle,
  deleteArticle,
  dislikeArticle,
  editArticle,
  getArticle,
  getArticlePrefernces,
  getArticles,
  getTrendingTopics,
  getUserArticles,
  likeArticle,
} from "../controllers/article.controller";

// import { validateArticle } from "../validators/article.validator";

const router = express.Router();

router.post("/signup", validateUserSignup, asyncWrapper(userSignup));
router.post("/signin", validateUserSignin, asyncWrapper(userSigin));

router.get("/preferences", asyncWrapper(getArticlePrefernces));
router.post("/articles", authenticate, asyncWrapper(addArticle));
router.get("/articles", authenticate, asyncWrapper(getArticles));
router.get("/trending", authenticate, asyncWrapper(getTrendingTopics));
router.get("/articles/:articleId", authenticate, asyncWrapper(getArticle));
router.patch(
  "/articles/:articleId/like",
  authenticate,
  asyncWrapper(likeArticle)
);
router.patch(
  "/articles/:articleId/dislike",
  authenticate,
  asyncWrapper(dislikeArticle)
);
router.put(
  "/articles/:articleId",
  authenticate,
  // validateArticle,
  asyncWrapper(editArticle)
);
router.delete(
  "/articles/:articleId",
  authenticate,
  asyncWrapper(deleteArticle)
);
router.get(
  "/users/:userId/articles",
  authenticate,
  asyncWrapper(getUserArticles)
);

router.put("/users", authenticate, asyncWrapper(updateProfile));
router.patch("/users", authenticate, asyncWrapper(changePassword));

router.get("/authenticate", asyncWrapper(getUser));
router.post("/signout", asyncWrapper(userSignout));

router.post("/refresh-token", asyncWrapper(getRefreshToken));

export default router;
