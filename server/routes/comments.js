import { Router } from "express";
import { readData, writeData } from "../utils/store.js";
import { randomUUID } from "crypto";

const router = Router();

/*  GET /api/comments?postId=1
 *  Returns all comments for a given postId
 */
router.get("/all", async (req, res) => {
  const postId = req.query.id;
  if (!postId) return res.status(400).json({ message: "postId query missing" });

  const comments = await readData();
  const filtered = comments.filter(c => String(c.postId) === String(postId));
  res.json(filtered);
});

/*  POST /api/comments
 *  Body: { postId, content }
 */
router.post("/post", async (req, res) => {
  const postId = req.query.id;
  const { content } = req.body;
  if (!postId || !content)
    return res.status(400).json({ message: "postId and content required" });

  const comments = await readData();
  const newComment = {
    id: randomUUID(),
    postId,
    content,
    createdAt: new Date().toISOString()
  };

  comments.push(newComment);
  await writeData(comments);
  res.status(201).json(newComment);
});

export default router;
