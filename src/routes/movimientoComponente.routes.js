import { Router } from "express";
import {methods as movComp} from "../controllers/movimientoComponente.controllers";

const router = Router();

router.post("/solicitar/movimiento/componentes", movComp.solicitarMovimientoDeComponentes);
router.get("/solicitudes/pendientes/movimiento/componente", movComp.getListaMovCompEqPendientes);
router.post("/detalle/movimiento/componente", movComp.getDetalleMovComponente);
router.put("/autorizar/movimiento/componentes", movComp.updateAutorizarMovComponente);
router.get("/solicitudes/autorizadas/movimiento/componente", movComp.getListaMovComponenteAutorizadas);

router.post("/realizar/movimiento/componentes", movComp.RealizarMovimientoDeComponente);
/*
router.get("/lista/movimientos/adicionales/pendientes", movAd.getListaMovEqPendientes);
router.put("/autorizar/movimiento/adicional", movAd.updateAutorizarMovEqAd);
router.get("/lista/movimientos/adicionales/autorizados", movAd.getListaMovAdAutorizadas);
router.post("/realizar/movimiento/adicional", movAd.RealizarMovimientoAdicional);
*/
export default router;