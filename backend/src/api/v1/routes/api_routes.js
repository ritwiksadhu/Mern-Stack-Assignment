import express from "express";
import {
  signup,
  login,
  getUser,
  verifyUserToken,
} from "../controllers/user_controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo_controller.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("api/v1 is called");
});
// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyUserToken);

// Protected route
router.get("/user/:userId", authMiddleware, getUser);

// protected routes for todo list
router.get("/todo", authMiddleware, getTodo);
router.get("/todos", authMiddleware, getTodos);
router.post("/todos", authMiddleware, createTodo);
router.put("/todos/:id", authMiddleware, updateTodo);
router.delete("/todos/:id", authMiddleware, deleteTodo);

export default router;
