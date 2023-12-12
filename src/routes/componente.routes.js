import { Router } from "express";
import {methods as componente} from "../controllers/componente.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.post("/add/component", componente.addComponente);

export default router;