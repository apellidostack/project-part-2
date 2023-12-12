import { Router } from "express";
import {methods as detItem} from "../controllers/detalleItem.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.post("/detalleItem/add", detItem.setDetalleItem);
router.put("/update/valor", detItem.updateValor);
export default router;