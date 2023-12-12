import { Router } from "express";
import {methods as dEquipo} from "../controllers/detalleEquipo.controller"

const router = Router();

router.post("/ver/detalleDeEquipo", dEquipo.getDetalleEquipo);
router.post("/ver/reporteTotal", dEquipo.getReporteTotalEq);
router.post("/ver/inventario/por/laboratorio", dEquipo.getInventarioXlab);




export default router;