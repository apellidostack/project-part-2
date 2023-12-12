import express from "express";
import morgan from "morgan";

const cors = require('cors');

//ROUTES
import languageRoutes from "./routes/language.routes";
import newMotivo from "./routes/motivo.routes";
import tipoComp from "./routes/tipoComponente";
import componente from "./routes/componente.routes";
import equipo from "./routes/equipo.routes";
import labs from "./routes/laboratorio.routes";
import items from "./routes/items.routes";
import equipoComponente from "./routes/equipoComponente.route"
import detalleEquipo from "./routes/detalleEquipo.routes"
import tabNormalizadas from "./routes/normalizadas.routes"
import detalleItem from "./routes/detalleItem.route";
import personal from "./routes/personal.routes";
import movimientoEq from "./routes/movimientos.routes";
import movimientoAd from "./routes/movimientoEqAdicional.routes";
import movimientoComp from "./routes/movimientoComponente.routes";
import bajaAdicional from "./routes/bajaAdicional.routes";
import bajaEquipo from "./routes/bajaDeEquipo.routes";

const app=express();

// Settings
app.set("port", 4000);

//middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
//app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


//


//routes
app.use("/",languageRoutes);
app.use("/",newMotivo);
app.use("/",tipoComp);
app.use("/",componente);
app.use("/",equipo);
app.use("/",labs);
app.use("/",items);
app.use("/",equipoComponente);
app.use("/",detalleEquipo);
app.use("/",tabNormalizadas);
app.use("/",detalleItem);
app.use("/",personal);
app.use("/",movimientoEq);
app.use("/",movimientoAd);
app.use("/",movimientoComp);
app.use("/",bajaAdicional);
app.use("/",bajaEquipo);

export default app;