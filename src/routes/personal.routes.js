import { Router } from "express";
import {methods as personal} from "../controllers/personal.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.post("/add/personal", personal.addPersonal);
router.get("/get/personal", personal.getPersonal);

router.post("/editar/personal", personal.getPersonalParaEditar);

export default router;