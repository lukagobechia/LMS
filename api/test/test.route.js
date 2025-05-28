import { Router } from "express";
import { getMembers } from "../test/test.service.js";
const testRouter = Router();

testRouter.get("/", getMembers);

export default testRouter;
