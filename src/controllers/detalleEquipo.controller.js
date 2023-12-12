import { getConnection } from "../database/database";

const getDetalleEquipo= async (req,res)=>{
    try {
        const { equipoSeleccionado } = req.body;
        const connection = await getConnection();
        const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getReporteTotalEq= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        let result;
        if(lab=="0"){
            result = await connection.query("CALL spReporteTotalEq()");
        }else{
            result = await connection.query("SELECT equipocomponente.codEC,equipocomponente.idEq,equipocomponente.CodComp,equipo.NombreEq,equipo.ip,equipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN equipocomponente ON equipocomponente.CodComp=componente.CodComp INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq INNER JOIN detalleitem ON equipocomponente.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=equipo.NroLab INNER JOIN marca ON marca.CodMar=equipocomponente.CodMar WHERE equipocomponente.Estado='Activo' AND laboratorio.NroLab=? ORDER BY equipo.NombreEq,equipocomponente.codEC",[lab]);
        }
        
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const getInventarioXlab= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const result = await connection.query("SELECT equipocomponente.codEC,equipocomponente.idEq,equipocomponente.CodComp,equipo.NombreEq,equipo.ip,equipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN equipocomponente ON equipocomponente.CodComp=componente.CodComp INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq INNER JOIN detalleitem ON equipocomponente.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=equipo.NroLab INNER JOIN marca ON marca.CodMar=equipocomponente.CodMar WHERE equipocomponente.Estado='Activo' AND laboratorio.NroLab=? ORDER BY equipo.NombreEq,equipocomponente.codEC",[lab]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
  getDetalleEquipo,
  getReporteTotalEq,
  getInventarioXlab
}