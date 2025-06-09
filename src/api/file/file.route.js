import { Router } from "express";
import multer from "multer";
import { uploadFile, getDownloadUrl, deleteFile } from "./file.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const FileRouter = Router();

FileRouter.post("/upload",upload.single("file"),authGuard,roleGuard("instructor"),uploadFile);
FileRouter.get("/:id/download", authGuard,roleGuard("student","instructor"), getDownloadUrl);
FileRouter.delete("/:id/delete", authGuard, roleGuard("instructor"), deleteFile);

export default FileRouter;
