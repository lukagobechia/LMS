import express from "express";
import cors from "cors";
import apiRouter from "./api/api.route.js";

const app = express();
app.use(cors());
app.use(express.json()); // express v4.16.0+

app.get("/", (req, res) => {
  res.redirect("api/test");
});

app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
