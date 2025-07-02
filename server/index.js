import express from "express";
import cors     from "cors";
import commentsRouter from "./routes/comments.js";

const app  = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/comments", commentsRouter);

app.get("/", (_req, res) => res.send("Comment API running ✅"));

app.listen(PORT, () =>
  console.log(`🚀  API listening at https://backendweather-g9j8.onrender.com`)
);
