import { Router } from "express";
import {methods as languageController} from "./../controllers/language.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.post("/api/languages", languageController.getLogin);

export default router;