import { Router } from "express";
import {methods as tabnorm} from "../controllers/normalizadas.controller"

const router = Router();

router.get("/ver/marca", tabnorm.getMarca);
//tipo de componente
router.post("/tipoComp/add", tabnorm.setTipoComponente);

//marca
router.post("/marca/add", tabnorm.setMarca);

//cargo
router.get("/cargo/get", tabnorm.getCargo);
router.post("/cargo/set", tabnorm.setCargo);

//motivo solicitud
router.post("/motivosoli/add", tabnorm.setMotivoSoli);

//industria
router.get("/industria/get", tabnorm.getIndustria);
router.post("/industria/set", tabnorm.setIndustria);

//modelo
router.get("/modelo/get", tabnorm.getModelo);
router.post("/modelo/set", tabnorm.setModelo);

//tipo equipo adicional
router.get("/tipoEqAd/get", tabnorm.getTipoAd);
router.post("/tipoEqAd/set", tabnorm.setTipoAd);

export default router;