import { Router } from "express";
import {methods as eqComp} from "../controllers/equipoComponente.controllers"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/eqComp/read", eqComp.getEquipoComponente);
router.post("/eqComp/read", eqComp.addEquipoComponente)
router.post("/add/eqComp", eqComp.addEquipo);
router.post("/verificar/equipo/existe", eqComp.getEquipoExiste);
router.post("/verificar/componente/existe", eqComp.getComponenteExiste);

router.post("/set/componente/a/equipo", eqComp.addComponenteAequipo);
//reporte
router.post("/reporte/por/componente", eqComp.GenerarReportePorComponente);


export default router;