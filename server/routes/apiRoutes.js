import axios from "axios";
import { Router } from "express";
import { login, logout, requireAdmin, showSession } from "../controllers/authController.js";
import {
  listFeedback,
  receiveFeedback,
} from "../controllers/feedbackController.js";
import {
  listGames,
  listImportableGames,
  publishGame,
  showFeaturedGame,
  showGame,
} from "../controllers/gamesController.js";
import {
  createComment,
  createNews,
  deleteNews,
  editNews,
  listNews,
  showNews,
} from "../controllers/newsController.js";

const router = Router();

router.get("/games", listGames);
router.get("/games/featured", showFeaturedGame);
router.get("/games/:id", showGame);
router.get("/news", listNews);
router.get("/news/:id", showNews);
router.post("/news/:id/comments", createComment);
router.post("/feedback", receiveFeedback);
router.get("/session", showSession);
router.post("/login", login);
router.post("/logout", logout);
router.use("/admin", requireAdmin);
router.get("/admin/games", listImportableGames);
router.post("/admin/games", publishGame);
router.get("/admin/feedback", listFeedback);
router.post("/admin/news", createNews);
router.put("/admin/news/:id", editNews);
router.delete("/admin/news/:id", deleteNews);

router.use((error, req, res, next) => {
  if (!axios.isAxiosError(error)) return next(error);

  if (error.response?.status === 404) {
    return res.status(404).json({ error: "Игра не найдена." });
  }

  res.status(502).json({ error: "Не удалось получить данные FreeToGame." });
});

export default router;
