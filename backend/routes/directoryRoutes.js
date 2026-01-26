import express from "express";
import { homeData } from "../controllers/directoryController.js";

const router = express.Router();

router.get("/home-data", homeData);

export default router;
