import { Router } from "express";
import {methods as equipo} from "../controllers/equipo.controllers"

const router = Router();

router.get("/get/equipo", equipo.verEquipo);
router.post("/add/equipoAd", equipo.addEquipoAdicional);
router.get("/get/equipoAdicional", equipo.getEquiposAd);

router.post("/get/reporte/equipo/adicional", equipo.getReporteEquiposAdicionales);
router.post("/get/reporte/alta/equipos", equipo.GenerarReporteAltaEquipo);
router.get("/get/fechas/alta/equipo", equipo.GetAniosEnAltaEquipo);
//baja
router.post("/get/reporte/baja/equipos", equipo.GenerarReporteBajaEquipo);
router.get("/get/fechas/baja/equipo", equipo.GetAniosEnBajaEquipo);


export default router;