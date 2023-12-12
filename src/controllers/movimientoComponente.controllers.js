import { getConnection } from "../database/database";

const solicitarMovimientoDeComponentes= async (req,res)=>{
    try {
        const datosSoli = req.body;
        const { numLab,equipoDestino }=datosSoli.formDataLabs;
        
        const connection = await getConnection();
        //
        const fechaActual = new Date();

        const opcionesFecha = { timeZone: 'America/La_Paz' };
        const año = fechaActual.getFullYear();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const día = fechaActual.getDate().toString().padStart(2, '0');
        const hora = fechaActual.getHours().toString().padStart(2, '0');
        const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
        const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
        
        const fechaYhoraActual = `${año}-${mes}-${día} ${hora}:${minutos}:${segundos}`;
        
        console.log(fechaYhoraActual);
        //
        const solicitarMovComponente = await connection.query("INSERT INTO movimientoeqcomponente(FechaSol, Estado, Ejecutor) VALUES (?,?,?)",[fechaYhoraActual,'Pendiente',datosSoli.codPer.nombre]);
        //console.log(res);
        const CodMovComp = await connection.query("SELECT max(CodMovEqComp)AS idMovComp FROM movimientoeqcomponente");
        
        //const insertmovCompPersonal = await connection.query("INSERT INTO movimientoeqcomppersonal(CodMovEqComp, CodPer, Rol) VALUES (?,?,?)",[CodMovComp[0].idMovComp,datosSoli.codPer,'Solicitante']);

        //
        const promises = datosSoli.filasSeleccionadas.map(async(datos)=>{
            const eqcomp = await connection.query("SELECT equipocomponente.codEC, equipocomponente.idEq, equipocomponente.CodComp, equipocomponente.Estado, equipocomponente.CodMar, equipo.NombreEq,equipo.NroLab FROM equipocomponente INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq WHERE equipocomponente.codEC=?", [datos]);
            const rescatarDeEqNuevo = await connection.query("SELECT * FROM equipo WHERE idEq=?", [equipoDestino]);
            
            const result = await connection.query("INSERT INTO historialmoveq(CodMovEqComp, codEC, idEq, CodComp, Estado, CodMar, equipoAnterior, equipoNuevo, labAnteriorC, labPosteriorC) VALUES (?,?,?,?,?,?,?,?,?,?)",[CodMovComp[0].idMovComp,datos,eqcomp[0].idEq,eqcomp[0].CodComp,'Anterior',eqcomp[0].CodMar,eqcomp[0].NombreEq,rescatarDeEqNuevo[0].NombreEq,numLab,rescatarDeEqNuevo[0].NroLab]);
            //console.log(eqcomp);//aqui hay errores xdddd
        })
        await Promise.all(promises);
        
        

        
        
        //console.log(Object.values(datos.newInputValues));
        const promises2 = datosSoli.filasSeleccionadas.map(async (dato) => {
            const eqcomp = await connection.query("SELECT equipocomponente.codEC, equipocomponente.idEq, equipocomponente.CodComp, equipocomponente.Estado, equipocomponente.CodMar, equipo.NombreEq,equipo.NroLab FROM equipocomponente INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq WHERE equipocomponente.codEC=?", [dato]);
            const rescatarDeEqNuevo = await connection.query("SELECT * FROM equipo WHERE idEq=?", [equipoDestino]);
            
            const result = await connection.query("INSERT INTO historialmoveq(CodMovEqComp, codEC, idEq, CodComp, Estado, CodMar, equipoAnterior, equipoNuevo, labAnteriorC, labPosteriorC) VALUES (?,?,?,?,?,?,?,?,?,?)",[CodMovComp[0].idMovComp,dato,equipoDestino,eqcomp[0].CodComp,'Posterior',eqcomp[0].CodMar,eqcomp[0].NombreEq,rescatarDeEqNuevo[0].NombreEq,numLab,rescatarDeEqNuevo[0].NroLab]);
            console.log(eqcomp);//aqui hay errores xdddd
        });
        
        await Promise.all(promises2);
        //
            
        //
        res.json("Se realizo la solicitud exitosamente");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

// lista de movimientos pendientes
const getListaMovCompEqPendientes= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMovEqComp AS id, FechaSol, FechaEjec, Estado, Ejecutor, Autorizador FROM movimientoeqcomponente WHERE Estado='Pendiente'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

// detalle de movimiento de componente
const getDetalleMovComponente= async (req,res)=>{
    try {
        const { cod } = req.body;
        const connection = await getConnection();
        const detalleMov = await connection.query("SELECT * FROM historialmoveq WHERE historialmoveq.CodMovEqComp=? AND historialmoveq.Estado='Posterior'",[cod]);
        const labMov = await connection.query("SELECT * FROM movimientoeqcomponente WHERE movimientoeqcomponente.CodMovEqComp=?",[cod]);
        const personalMov = await connection.query("SELECT * FROM movimientoeqcomponente WHERE movimientoeqcomponente.CodMovEqComp=?",[cod]);
        //console.log(lab);
        res.json({detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateAutorizarMovComponente= async (req,res)=>{
    try {
        const datosAutorizacion = req.body;
        const codPer=datosAutorizacion.codPer.nombre;
        const connection = await getConnection();
        const vec=datosAutorizacion.autorizar.split('/');
        const detalleMov = await connection.query("UPDATE movimientoeqcomponente SET Autorizador=?,Estado=? WHERE CodMovEqComp=?",[codPer,vec[1],vec[0]]);
        //const insertmovEqPersonal = await connection.query("INSERT INTO movimientoeqpersonal(CodPer, CodMov, Rol) VALUES (?,?,?)",[codPer,vec[0],vec[1]]);
        //console.log(lab);
        res.json(detalleMov);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//lista de movimientos de componentes autorizadas
const getListaMovComponenteAutorizadas= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMovEqComp AS id, FechaSol, FechaEjec, Estado, Ejecutor, Autorizador FROM movimientoeqcomponente WHERE Estado='Autorizada'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//realizar movimiento
const RealizarMovimientoDeComponente= async (req,res)=>{
    try {
        
        const xd=req.body.infoMovEq.detalleMov
       console.log(xd.detalleMov);
       //console.log(xd.labMov[0]);
       //const labnuevo=(xd.labMov[0].Tipo=='nuevo')?xd.labMov[0].NroLab:xd.labMov[1].NroLab; 
       const labnuevo=xd.labMov[0].NroLab;

       const fechaActual = new Date();

       const opcionesFecha = { timeZone: 'America/La_Paz' };
       const año = fechaActual.getFullYear();
       const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
       const día = fechaActual.getDate().toString().padStart(2, '0');
       const hora = fechaActual.getHours().toString().padStart(2, '0');
       const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
       const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
       
       const fechaYhoraActual = `${año}-${mes}-${día} ${hora}:${minutos}:${segundos}`;
       
       console.log(fechaYhoraActual);
       //console.log(labnuevo);
        const connection = await getConnection();
        //const repetido=await connection.query("SELECT * FROM equipocomponente WHERE idEq=?",[lab+'-'+nombreEq]);
        
        //addcomponente
        const eqcomp = await connection.query("UPDATE movimientoeqcomponente SET Estado=?,FechaEjec=? WHERE CodMovEqComp=?", ['Realizada',fechaYhoraActual,xd.detalleMov[0].CodMovEqComp]);
        
        const promises0 = Object.values(xd.detalleMov).map(async (dato) => {
            const eqcomp = await connection.query("UPDATE equipocomponente SET idEq=? WHERE codEC=?", [dato.idEq,dato.codEC]);
        
        });
        
        await Promise.all(promises0);
        
        
       
        res.json('ok');
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    solicitarMovimientoDeComponentes,
    getListaMovCompEqPendientes,
    getDetalleMovComponente,
    updateAutorizarMovComponente,
    getListaMovComponenteAutorizadas,
    RealizarMovimientoDeComponente
}