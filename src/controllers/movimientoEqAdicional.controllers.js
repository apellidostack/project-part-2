import { getConnection } from "../database/database";

const xd= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getEquiposAdicionalesDisponibles= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM equipoadicional WHERE Estado='Activo' AND NroLab=?",[lab]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const solicitarMovimientoDeEquipoAdicional= async (req,res)=>{
    try {
        const datosSoli = req.body;
        const { numLab,labDestino }=datosSoli.formDataLabs;
        const connection = await getConnection();
        //
        // Obtén la hora actual en formato "HH:MM:SS"
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
        const solicitarMovimientoAd = await connection.query("INSERT INTO movimientoeqad(FechaS, Estado, labAnterior, NroLab, Ejecutor) VALUES (?,?,?,?,?)",[fechaYhoraActual,'Pendiente',numLab,labDestino,datosSoli.codPer.nombre]);
        //console.log(res);
        const CodMovAd = await connection.query("SELECT max(CodMovAd)AS idMovAd FROM movimientoeqad");
        //LO QUITE
        //const insertmovAdPersonal = await connection.query("INSERT INTO moveqadpersonal(CodMovAd, CodPer, Rol) VALUES (?,?,'Solicitante')",[CodMovAd[0].idMovAd,datosSoli.codPer.nombre]);

            const promises = Object.entries(datosSoli.formData).map(async(datos)=>{
                let auxEn=datos[0].split('/');
                let nuevoNombre=auxEn[1].split('-');
                let nombreNuevoInsertar=`${nuevoNombre[0]}-${labDestino}-${datos[1]}`
                const result = await connection.query("INSERT INTO detallemovimientoeqad(CodMovAd, idEqAd, nomAdAnterior, nomAdNuevo) VALUES (?,?,?,?)",[CodMovAd[0].idMovAd,auxEn[0],auxEn[1],nombreNuevoInsertar]);
                
            })
            await Promise.all(promises);
        //
        res.json("Se realizo la solicitud exitosamente");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//detalle de movimiento adicional
const getDetalleMovAd= async (req,res)=>{
    try {
        const { cod } = req.body;
        const connection = await getConnection();
        const detalleMov = await connection.query("SELECT * FROM detallemovimientoeqad WHERE CodMovAd=?",[cod]);
        const labMov = await connection.query("SELECT * FROM movimientoeqad WHERE CodMovAd=?",[cod]);
        const personalMov = await connection.query("SELECT * FROM movimientoeqad WHERE CodMovAd=?",[cod]);
        //console.log(lab); FALTA LA VISTA AUTORIZAR EQAD Y DETALLE
        res.json({detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//lista de movimientos pendientes
const getListaMovEqPendientes= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMovAd AS id,Ejecutor FROM movimientoeqad WHERE Estado='Pendiente'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//autorizar movimiento de equipo adicional
const updateAutorizarMovEqAd= async (req,res)=>{
    try {
        const datosAutorizacion = req.body;
        const codPer=datosAutorizacion.codPer.nombre;
        const connection = await getConnection();
        const vec=datosAutorizacion.autorizar.split('/');
        const detalleMov = await connection.query("UPDATE movimientoeqad SET Autorizador=?,Estado=? WHERE CodMovAd=?",[codPer,vec[1],vec[0]]);
        //const insertmovEqPersonal = await connection.query("INSERT INTO moveqadpersonal(CodMovAd, CodPer, Rol) VALUES (?,?,?)",[vec[0],codPer,vec[1]]);
        //console.log(lab);
        res.json(detalleMov);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getListaMovAdAutorizadas= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMovAd AS id,Autorizador,Estado FROM movimientoeqad WHERE Estado='Autorizada'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//realizar movimiento
const RealizarMovimientoAdicional= async (req,res)=>{
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
        
         const promises = Object.values(xd.detalleMov).map(async(dato)=>{
            const result = await connection.query("UPDATE equipoadicional SET CodEquipoAd=?,NroLab=? WHERE idEqAd=?",[dato.nomAdNuevo,labnuevo,dato.idEqAd]);
            //rescato idEq
            const updateMovEqAd = await connection.query("UPDATE movimientoeqad SET FechaMov=?,Estado=? WHERE CodMovAd=?",[fechaYhoraActual,'Realizado',dato.CodMovAd]);
            
        })
        //const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[codComp,codTipoComp]);
        //eqComp
        await Promise.all(promises);
        
        res.json('ok');
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}


//REPORTE BAJA DE EQUIPOS ADICIONALES POR GESTION
const GenerarReporteMovimientoEquipoAdicional= async (req,res)=>{
    try {
      const { lab } = req.body;
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        const result = await connection.query("SELECT movimientoeqad.CodMovAd,equipoadicional.idEqAd AS id,detallemovimientoeqad.nomAdAnterior,detallemovimientoeqad.nomAdNuevo,equipoadicional.NroSerie,tipoequipoadicional.DescripEqAd,marca.DescripMar,modelo.Descrip,industria.DescripInd,equipoadicional.NroLab,movimientoeqad.FechaMov,movimientoeqad.Ejecutor,movimientoeqad.Autorizador FROM movimientoeqad INNER JOIN detallemovimientoeqad ON movimientoeqad.CodMovAd=detallemovimientoeqad.CodMovAd INNER JOIN equipoadicional ON equipoadicional.idEqAd=detallemovimientoeqad.idEqAd INNER JOIN marca ON marca.CodMar=equipoadicional.CodMar INNER JOIN industria ON industria.CodInd=equipoadicional.CodInd INNER JOIN modelo ON modelo.CodMod=equipoadicional.CodMod INNER JOIN tipoequipoadicional ON tipoequipoadicional.CodTipoEqAd=equipoadicional.CodTipoEqAd WHERE date_format(movimientoeqad.FechaMov,'%Y')=?",[lab]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }
  
  const GetAniosEnMovimientoEquipoAdicional= async (req,res)=>{
    try {
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        const result = await connection.query("SELECT DISTINCT date_format(movimientoeqad.FechaMov,'%Y')AS fecha FROM movimientoeqad WHERE Estado='Realizado'");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }
  


export const methods = {
    getEquiposAdicionalesDisponibles,
    solicitarMovimientoDeEquipoAdicional,
    getDetalleMovAd,
    getListaMovEqPendientes,
    updateAutorizarMovEqAd,
    getListaMovAdAutorizadas,
    RealizarMovimientoAdicional,
    GenerarReporteMovimientoEquipoAdicional,
    GetAniosEnMovimientoEquipoAdicional
}