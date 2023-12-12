import { Router } from "express";
import {methods as items} from "../controllers/items.controllers"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/items/read", items.getItems);
router.post("/items/add", items.setItems);

export default router;