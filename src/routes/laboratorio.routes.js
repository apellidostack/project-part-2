import { Router } from "express";
import {methods as labs} from "../controllers/laboratorio.controllers"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/labs/read", labs.getLabs);
router.post("/labs/add", labs.setLabs);

export default router;