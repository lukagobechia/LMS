import express from "express";
import cors from "cors";
import apiRouter from "./src/api/apiRouter.js";
import morgan from 'morgan'

const app = express();
app.use(cors());
app.use(express.json()); // express v4.16.0+

app.use(morgan('dev'));

app.get("/", (req, res) => {
  res.redirect("api/");
});

app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
