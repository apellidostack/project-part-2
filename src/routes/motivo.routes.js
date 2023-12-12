import { Router } from "express";
import {methods as solicitudMotivo} from "./../controllers/solicitud.motivo"

const router = Router();

//router.get("/", languageController.getLanguage);
router.get("/get/motivo", solicitudMotivo.getMotivo);
router.post("/Solicitud/motivo", solicitudMotivo.getnewMotivo);
//tipo solicitud
router.get("/get/tiposol", solicitudMotivo.getTipoSol);
//equipos para solicitud
router.post("/equipos/validos/solicitud", solicitudMotivo.getEquiposParaReportar);
//REGISTRAR solicitud
router.post("/set/solicitud", solicitudMotivo.setSolicitud);
//Solicitudes pendientes
router.get("/get/mantenimiento/pendiente", solicitudMotivo.getMantenimientoPendiente);
//detalle de solicitud de mantenimiento
router.post("/get/detalle/solicitud/mantenimiento", solicitudMotivo.getDetalleSolicitudMantenimiento);
router.post("/set/atender/solicitud", solicitudMotivo.setAtenderSolicitud);
export default router;