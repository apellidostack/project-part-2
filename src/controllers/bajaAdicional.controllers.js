import { getConnection } from "../database/database";

//motivo de baja adicional
const setMotivoBajaAdicional= async (req,res)=>{
  try {
      const { motivo } = req.body;
      const connection = await getConnection();
      const result = await connection.query("INSERT INTO motivobajaad(DescripMot) VALUES (?)",[motivo]);
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

const getMotivoBajaAdicional= async (req,res)=>{
  try {
      const connection = await getConnection();
      const result = await connection.query("SELECT * FROM motivobajaad");
      //const result = await connection.query("CALL spTipoCOmp()");
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//
const getEquiposAdicionalesParaSolicitarBaja= async (req,res)=>{
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

//solicitar baja de equipo adicional
const solicitarBajaDeEquipoAdicional= async (req,res)=>{
  try {
      const datosSoli = req.body;
      const { numLab,motivo }=datosSoli.formDataLabs;
      console.log(motivo);
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
      const solicitarBajaAd = await connection.query("INSERT INTO bajaeqad(fechaSol, Estado, CodMot, Ejecutor) VALUES (?,?,?,?)",[fechaYhoraActual,'Pendiente',motivo,datosSoli.codPer.nombre]);
      //console.log(res);
      const CodBajaAd = await connection.query("SELECT max(CodBajaAd)AS idBajaAd FROM bajaeqad");
      
      //const insertBajaAdPersonal = await connection.query("INSERT INTO bajaeqadpersonal(CodBajaAd, CodPer, Rol) VALUES (?,?,?)",[CodBajaAd[0].idBajaAd,datosSoli.codPer,'Solicitante']);

          const promises = Object.entries(datosSoli.clicados).map(async(datos)=>{
              /* let auxEn=datos[0].split('/');
              let nuevoNombre=auxEn[1].split('-');
              let nombreNuevoInsertar=`${nuevoNombre[0]}-${labDestino}-${datos[1]}` */
              const result = await connection.query("INSERT INTO detallebajaeqad(CodBajaAd, idEqAd) VALUES (?,?)",[CodBajaAd[0].idBajaAd,datos[1]]);
              
          })
          await Promise.all(promises);
      //
      res.json("Se realizo la solicitud exitosamente");
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//detalle de baja adicional
const getDetalleBajaAd= async (req,res)=>{
  try {
      const { cod } = req.body;
      const connection = await getConnection();
      const detalleMov = await connection.query("SELECT detallebajaeqad.CodBajaAd,detallebajaeqad.idEqAd,equipoadicional.CodEquipoAd FROM detallebajaeqad INNER JOIN equipoadicional ON equipoadicional.idEqAd=detallebajaeqad.idEqAd WHERE CodBajaAd=?",[cod]);
      const labMov = await connection.query("SELECT * FROM bajaeqad WHERE CodBajaAd=?",[cod]);
      const personalMov = await connection.query("SELECT * FROM bajaeqad WHERE CodBajaAd=?",[cod]);
      //console.log(lab); FALTA LA VISTA AUTORIZAR EQAD Y DETALLE
      res.json({detalleMov,labMov,personalMov});
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//lista de bajas adicionales pendientes
const getListaBajaAdPendientes= async (req,res)=>{
  try {
      const connection = await getConnection();
      const result = await connection.query("SELECT CodBajaAd AS id, FechaSol, Estado, Ejecutor, Autorizador, CodMot FROM bajaeqad WHERE Estado='Pendiente'");
      //console.log(lab);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}


//autorizar baja de equipo adicional
const updateAutorizarBajaAdicional= async (req,res)=>{
  try {
      const datosAutorizacion = req.body;
      const codPer=datosAutorizacion.codPer.nombre;
      const connection = await getConnection();
      const vec=datosAutorizacion.autorizar.split('/');
      const detalleMov = await connection.query("UPDATE bajaeqad SET Autorizador=?,Estado=? WHERE CodBajaAd=?",[codPer,vec[1],vec[0]]);
      //const insertBajaEqAdPersonal = await connection.query("INSERT INTO bajaeqadpersonal(CodBajaAd, CodPer, Rol) VALUES (?,?,?)",[vec[0],codPer,'Autorizador']);
      //console.log(lab);
      res.json(detalleMov);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}


//lista baja de equipo adicional autorizadas
const getListaBajaAdicionalAutorizadas= async (req,res)=>{
  try {
      const connection = await getConnection();
      const result = await connection.query("SELECT CodBajaAd AS id, FechaSol, Estado, Ejecutor, Autorizador, CodMot FROM bajaeqad WHERE Estado='Autorizada'");
      //console.log(lab);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//realizar baja
const RealizarBajaAdicional= async (req,res)=>{
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
          const result = await connection.query("UPDATE equipoadicional SET Estado='Baja' WHERE idEqAd=?",[dato.idEqAd]);
          //rescato idEq
          const updateMovEqAd = await connection.query("UPDATE bajaeqad SET FechaBaja=?,Estado=? WHERE CodBajaAd=?",[fechaYhoraActual,'Realizado',dato.CodBajaAd]);
          
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
const GenerarReporteBajaEquipoAdicional= async (req,res)=>{
    try {
      const { lab } = req.body;
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        const result = await connection.query("SELECT equipoadicional.idEqAd AS id,bajaeqad.CodBajaAd,equipoadicional.CodEquipoAd,equipoadicional.NroSerie,tipoequipoadicional.DescripEqAd,marca.DescripMar,modelo.Descrip,industria.DescripInd,equipoadicional.NroLab,motivobajaad.DescripMot,bajaeqad.FechaBaja,bajaeqad.Ejecutor,bajaeqad.Autorizador FROM bajaeqad INNER JOIN detallebajaeqad ON bajaeqad.CodBajaAd=detallebajaeqad.CodBajaAd INNER JOIN equipoadicional ON equipoadicional.idEqAd=detallebajaeqad.idEqAd INNER JOIN marca ON marca.CodMar=equipoadicional.CodMar INNER JOIN industria ON industria.CodInd=equipoadicional.CodInd INNER JOIN modelo ON modelo.CodMod=equipoadicional.CodMod INNER JOIN tipoequipoadicional ON tipoequipoadicional.CodTipoEqAd=equipoadicional.CodTipoEqAd INNER JOIN motivobajaad ON motivobajaad.CodMot=bajaeqad.CodMot WHERE date_format(bajaeqad.FechaBaja,'%Y')=?",[lab]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }
  
  const GetAniosEnBajaEquipoAdicional= async (req,res)=>{
    try {
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        const result = await connection.query("SELECT DISTINCT date_format(bajaeqad.FechaBaja,'%Y')AS fecha FROM bajaeqad WHERE Estado='Realizado'");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }
  


export const methods = {
  getMotivoBajaAdicional,
  setMotivoBajaAdicional,
  getEquiposAdicionalesParaSolicitarBaja,
  solicitarBajaDeEquipoAdicional,
  getDetalleBajaAd,
  getListaBajaAdPendientes,
  updateAutorizarBajaAdicional,
  getListaBajaAdicionalAutorizadas,
  RealizarBajaAdicional,
  GenerarReporteBajaEquipoAdicional,
  GetAniosEnBajaEquipoAdicional
}