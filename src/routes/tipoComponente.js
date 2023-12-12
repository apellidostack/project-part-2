import { Router } from "express";
import {methods as tipoComp} from "../controllers/tipoComponente.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/tipoComp/read", tipoComp.getTipoComp);

export default router;