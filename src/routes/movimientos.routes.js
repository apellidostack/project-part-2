import { Router } from "express";
import {methods as mover} from "./../controllers/movimientos.controller"

const router = Router();

//router.get("/", languageController.getLanguage);
router.post("/get/equipos/movimiento", mover.getEquiposParaSolicitarMovimiento);
router.post("/set/movimiento", mover.setMovimientoEq);
//listaMovEq
router.get("/lista/solicitar/movEq", mover.getListaMovEqPendientes);
//detalle mov equipo
router.post("/lista/detalleMov/equipo", mover.getDetalleMovEq);
//actualizar estado de movimiento equipo a autorizado
router.put("/autorizar/movimiento/equipo", mover.updateAutorizarMovEq);
//lista de movimientos de equipos autorizados
router.get("/get/movimientos/autorizados", mover.getListaMovEqAutorizadas);
//realizar movimiento
router.post("/realizar/movimiento", mover.RealizarMovimiento);
//historico movimiento de equipo
router.post("/get/historico/movimiento", mover.geMovimientoEqHistorico);
//vista movimientos equipo
router.get("/get/movimientos/realizados", mover.getListaMovEqRealizados);
//movimiento de componentes
router.get("/get/lista/componentes", mover.getListaComponentes);
//historico de equipo
router.post("/get/historico/equipo", mover.getHIstoricoDeEquipo);
//gestiones
router.get("/get/gestiones/movimiento", mover.GetAniosEnMovimientoEquipo);
//MOVIMIENTOS POR GESTION
router.post("/get/movimientos/por/gestion", mover.geMovimientoEqPorGestion);



export default router;