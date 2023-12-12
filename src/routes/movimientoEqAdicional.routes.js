import { Router } from "express";
import {methods as movAd} from "../controllers/movimientoEqAdicional.controllers";

const router = Router();

router.post("/get/equipoAdicional/para/mover", movAd.getEquiposAdicionalesDisponibles);
router.post("/solicitar/movimiento/equipo/adicional", movAd.solicitarMovimientoDeEquipoAdicional);
router.post("/lista/detalle/movimiento/adicional", movAd.getDetalleMovAd);

router.get("/lista/movimientos/adicionales/pendientes", movAd.getListaMovEqPendientes);
router.put("/autorizar/movimiento/adicional", movAd.updateAutorizarMovEqAd);
router.get("/lista/movimientos/adicionales/autorizados", movAd.getListaMovAdAutorizadas);
router.post("/realizar/movimiento/adicional", movAd.RealizarMovimientoAdicional);
//Reportes
router.get("/get/fechas/movimiento/equipo/adicional", movAd.GetAniosEnMovimientoEquipoAdicional);
router.post("/get/reporte/movimiento/equipo/adicional/por/gestion", movAd.GenerarReporteMovimientoEquipoAdicional);


export default router;