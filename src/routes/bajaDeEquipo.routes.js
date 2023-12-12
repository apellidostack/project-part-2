import { Router } from "express";
import {methods as bajaEquipo} from "./../controllers/bajaDeEquipo.controllers"

const router = Router();

router.post("/set/motivo/baja/equipo", bajaEquipo.setMotivoBajaEquipo);
router.get("/get/motivo/baja/equipo", bajaEquipo.getMotivoBajaEquipo);
//router.get("/", languageController.getLanguage);
router.post("/get/equipos/baja", bajaEquipo.getEquiposParaSolicitarBaja);
router.post("/set/baja/equipo", bajaEquipo.setBajaEquipo);
//listaMovEq
router.get("/lista/solicitar/baja/equipo", bajaEquipo.getListaBajaEqPendientes);
//detalle mov equipo
router.post("/lista/detalle/baja/equipo", bajaEquipo.getDetalleBajaEquipo);
//actualizar estado de movimiento equipo a autorizado
router.put("/autorizar/baja/equipo", bajaEquipo.updateAutorizarBajaEquipo);
//lista de movimientos de equipos autorizados
router.get("/get/bajas/autorizados", bajaEquipo.getListaBajaEquipoAutorizadas);
//realizar movimiento
router.post("/realizar/baja", bajaEquipo.RealizarBaja);



export default router;