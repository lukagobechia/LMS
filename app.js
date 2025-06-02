import express from "express";
import cors from "cors";
import apiRouter from "./src/api/apiRouter.js";
import morgan from "morgan";
import path from "path";
import connectDB from "./src/config/db.js";
import { fileURLToPath } from "url";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); // express v4.16.0+
app.use(morgan("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
