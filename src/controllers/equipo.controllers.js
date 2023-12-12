import { getConnection } from "../database/database";


const verEquipo= async (req,res)=>{
  try {
      const connection = await getConnection();
      const result = await connection.query("CALL spVerEquipos()");
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//reporte alta de equipos

const GenerarReporteAltaEquipo= async (req,res)=>{
  try {
    const { lab } = req.body;
      const connection = await getConnection();
      //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
      const result = await connection.query("SELECT altaequipo.FechaAlta as FechaEjec,altaequipo.IdAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar WHERE date_format(altaequipo.FechaAlta,'%Y')=? ORDER BY altaequipo.FechaAlta,altaequipo.NombreEq,detallealtaequipo.codEC",[lab]);
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}


const GetAniosEnAltaEquipo= async (req,res)=>{
  try {
      const connection = await getConnection();
      //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
      const result = await connection.query("SELECT DISTINCT date_format(altaequipo.FechaAlta,'%Y')AS fecha FROM altaequipo");
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//REPORTE BAJA DE EQUIPOS POR GESTION
const GenerarReporteBajaEquipo= async (req,res)=>{
  try {
    const { lab } = req.body;
      const connection = await getConnection();
      //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");ORDENE POR FECHA Y FUNCIONO
      const result = await connection.query("SELECT bajaequipo.FechaEjec as FechaEjec,historialbajaequipo.codEC,equipo.NombreEq,equipo.NroLab,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN historialbajaequipo ON historialbajaequipo.CodComp=componente.CodComp INNER JOIN bajaequipo ON bajaequipo.CodBaja=historialbajaequipo.CodBaja INNER JOIN detalleitem ON historialbajaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN marca ON marca.CodMar=historialbajaequipo.CodMar INNER JOIN equipo ON equipo.idEq=historialbajaequipo.idEq WHERE date_format(bajaequipo.FechaEjec,'%Y')=? ORDER BY bajaequipo.FechaEjec,equipo.NombreEq,historialbajaequipo.codEC",[lab]);
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

const GetAniosEnBajaEquipo= async (req,res)=>{
  try {
      const connection = await getConnection();
      //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
      const result = await connection.query("SELECT DISTINCT date_format(bajaequipo.FechaEjec,'%Y')AS fecha FROM bajaequipo WHERE Estado='Realizado'");
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

//equipos adicionales
const getEquiposAd= async (req,res)=>{
  try {
      const connection = await getConnection();
      const result = await connection.query("CALL spListarEquiposAd()");
      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}

const addEquipoAdicional= async (req,res)=>{
    try {
      const { cod,numSerie,fecha,lab,tipo,ind,modelo,mar } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO equipoadicional(CodEquipoAd, Estado, NroSerie, FechaAdquisicion, NroLab, CodTipoEqAd, CodInd, CodMod, CodMar) VALUES (?,'Activo',?,?,?,?,?,?,?)",[cod,numSerie,fecha,lab,tipo,ind,modelo,mar]);
        const rescataridEqAd = await connection.query("SELECT MAX(idEqAd) AS idEqAd FROM equipoadicional");
        console.log(rescataridEqAd);
        const altaEqAd = await connection.query("INSERT INTO altaequipoadicional(idEqAd, NroLab) VALUES (?,?)",[rescataridEqAd[0].idEqAd,lab]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


// reporte equipos adicionales disponibles
const getReporteEquiposAdicionales= async (req,res)=>{
  try {
    const { lab } = req.body;
      const connection = await getConnection();
      let result;
      if(lab == "0"){
        result = await connection.query("CALL spListarEquiposAd()");
      }else{
        result = await connection.query("SELECT equipoadicional.idEqAd AS id,equipoadicional.CodEquipoAd,equipoadicional.NroSerie,tipoequipoadicional.DescripEqAd,marca.DescripMar,modelo.Descrip,industria.DescripInd,equipoadicional.NroLab FROM equipoadicional INNER JOIN marca ON marca.CodMar=equipoadicional.CodMar INNER JOIN industria ON industria.CodInd=equipoadicional.CodInd INNER JOIN modelo ON modelo.CodMod=equipoadicional.CodMod INNER JOIN tipoequipoadicional ON tipoequipoadicional.CodTipoEqAd=equipoadicional.CodTipoEqAd WHERE equipoadicional.Estado='Activo' AND equipoadicional.NroLab=?",[lab]);
      }

      //console.log(res);
      res.json(result);
  } catch (error) {
      res.status(500);
      res.send(error.message);
  }
}



export const methods = {
  addEquipoAdicional,
  verEquipo,
  getEquiposAd,
  getReporteEquiposAdicionales,
  GenerarReporteAltaEquipo,
  GetAniosEnAltaEquipo,
  GenerarReporteBajaEquipo,
  GetAniosEnBajaEquipo
}