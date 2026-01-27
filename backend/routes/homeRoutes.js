import express from "express";
import { homeData } from "../controllers/homeController.js";

const router = express.Router();

router.get("/home-data", homeData);

export default router;
