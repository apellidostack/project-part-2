import { Router } from "express";
import {methods as bajaAd} from "../controllers/bajaAdicional.controllers"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/get/motivo/baja/adicional", bajaAd.getMotivoBajaAdicional);
router.post("/set/motivo/baja/adicional", bajaAd.setMotivoBajaAdicional);

router.post("/get/equipos/adicionales/disponibles/baja", bajaAd.getEquiposAdicionalesParaSolicitarBaja);
router.post("/solicitar/baja/equipo/adicional", bajaAd.solicitarBajaDeEquipoAdicional);
router.post("/detalle/baja/equipo/adicional", bajaAd.getDetalleBajaAd);
router.get("/baja/equipo/adicional/pendientes", bajaAd.getListaBajaAdPendientes);
router.put("/autorizar/baja/equipo/adicional", bajaAd.updateAutorizarBajaAdicional);
router.get("/baja/equipos/adicionales/autorizadas", bajaAd.getListaBajaAdicionalAutorizadas);
router.post("/realizar/baja/equipo/adicional", bajaAd.RealizarBajaAdicional);
//Reportes
router.get("/fechas/baja/equipo/adicional/por/gestion", bajaAd.GetAniosEnBajaEquipoAdicional);
//
router.post("/reporte/baja/equipo/adicional/gestion", bajaAd.GenerarReporteBajaEquipoAdicional);
export default router;