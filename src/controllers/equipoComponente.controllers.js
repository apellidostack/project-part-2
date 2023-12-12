import { getConnection } from "../database/database";


//validar equipo
const getEquipoExiste= async (req,res)=>{
    try {
        let { buscarEq } = req.body;
        console.log(buscarEq);
        let aux=buscarEq.split('-');
        if(aux[1].length==1){
            buscarEq = `${aux[0]}-0${aux[1]}`;
          }
        const connection = await getConnection();
        const result = await connection.query("SELECT NombreEq FROM equipo WHERE NombreEq=?",[buscarEq]);
        //console.log(res);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//validar componente
const getComponenteExiste= async (req,res)=>{
    try {
        const { buscarCod } = req.body;
        console.log(buscarCod);
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM componente WHERE CodComp=?",[buscarCod]);
        //console.log(res);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const addEquipo= async (req,res)=>{
    try {
        const datos = req.body;
      let { fecha,nombreEq,lab } = datos.formEq;
      if(Object.entries(datos.newInputValues).length==0){
        throw({message: 'Debe ingresar las partes del Equipo'});
      }
      console.log(datos.newInputValues);
      ;
      if(nombreEq.length==1){
        nombreEq = `0${nombreEq}`;
      }
        const connection = await getConnection();
        const repetido=await connection.query("SELECT * FROM equipo WHERE NombreEq=? AND Estado='Activo'",[lab+'-'+nombreEq]);
        if(Object.keys(repetido).length>0){
            //const result = await connection.query("CALL spActualizarEq(?,?,?,?)",[lab+'-'+nombreEq,ip,mac,lab]);
            console.log("repetido");
        }else{
            const result = await connection.query("INSERT INTO equipo(NombreEq, NroLab, Estado) VALUES(?,?,?)",[lab+'-'+nombreEq,lab,'Activo']);
            const veridequipo1 = await connection.query("SELECT idEq FROM equipo WHERE NombreEq=? AND Estado='Activo'",[[lab+'-'+nombreEq]]);
            
            const altaeq = await connection.query("INSERT INTO altaequipo(FechaAlta,idEq, NombreEq, NroLab) VALUES (?,?,?,?)",[fecha,veridequipo1[0].idEq,lab+'-'+nombreEq,lab])
            console.log("todo bien");
        }
        //addcomponente

        const promises = Object.values(datos.newInputValues).map(async(dato)=>{
            const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[dato[0],[fecha],dato[1]]);
            
            //rescato idEq
            const verideq = await connection.query("SELECT idEq FROM equipo WHERE NombreEq=? AND Estado='Activo'",[[lab+'-'+nombreEq]]);
            //rescato cod alta
            const rescatarIdAlta = await connection.query("SELECT IdAlta FROM altaequipo WHERE idEq=?",[verideq[0].idEq]);
            
            const verifEqComp = await connection.query("SELECT * FROM equipocomponente WHERE idEq=? AND CodComp=? AND Estado='Activo'",[verideq[0].idEq,dato[0]]);
            
            if(Object.keys(verifEqComp).length>0){
                console.log(dato[2]);
                const updateEqComp = await connection.query("UPDATE equipocomponente SET Estado='anterior' WHERE codEC=?",[verifEqComp[0].codEC]);
                const insertEqComp = await connection.query("CALL spInsertarEquipoComponente(?,?,'Activo',?)",[[verideq[0].idEq],dato[0],dato[2]]);
            }else{
                const insertEqComp = await connection.query("CALL spInsertarEquipoComponente(?,?,'Activo',?)",[[verideq[0].idEq],dato[0],dato[2]]);
                const rescatarCodEC = await connection.query("SELECT codEC FROM equipocomponente WHERE idEq=? AND CodComp=? AND Estado='Activo'",[verideq[0].idEq,dato[0]]);
            
                const detalleAlta = await connection.query("INSERT INTO detallealtaequipo(IdAlta, codEC, idEq, CodComp, Estado, CodMar) VALUES (?,?,?,?,?,?)",[rescatarIdAlta[0].IdAlta,rescatarCodEC[0].codEC,verideq[0].idEq,dato[0],'Activo',dato[2]]);
            }
        })
        //const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[codComp,codTipoComp]);
        //eqComp
        await Promise.all(promises);
        const listaEqComp = await connection.query("SELECT equipocomponente.codEC,equipocomponente.idEq,equipocomponente.CodComp,equipocomponente.Estado,equipocomponente.CodMar,equipo.NombreEq,tipocomponente.DescripCo FROM equipocomponente LEFT JOIN equipo ON equipo.idEq=equipocomponente.idEq LEFT JOIN componente ON componente.CodComp=equipocomponente.CodComp LEFT JOIN tipocomponente ON tipocomponente.CodTipoComp=componente.CodTipoComp WHERE equipo.NombreEq=? AND equipocomponente.Estado='Activo'",[[lab+'-'+nombreEq]]);
        //console.log(Object.values(datos.newInputValues));
        res.json(listaEqComp);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

//add componente


//equipo componente
const getEquipoComponente= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("CALL spListarEqComp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const addEquipoComponente= async (req,res)=>{
    try {
      const { nom,codC,cmar } = req.body;
        const connection = await getConnection();
        const result = await connection.query("CALL spInsertarEquipoComponente(?,?,'Disponible',?)",[nom,codC,cmar]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


//REPORTE POR COMPONENTE
const GenerarReportePorComponente= async (req,res)=>{
    try {
      const { codTipoComp,lab } = req.body.formData;
      console.log('cod: '+codTipoComp+' lab: '+lab);
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        let result;
        if(lab=="0"){
            result = await connection.query("SELECT equipocomponente.codEC,equipo.NombreEq,laboratorio.NroLab,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN equipocomponente ON equipocomponente.CodComp=componente.CodComp INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq INNER JOIN detalleitem ON equipocomponente.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=equipo.NroLab INNER JOIN marca ON marca.CodMar=equipocomponente.CodMar WHERE equipocomponente.Estado='Activo' AND tipocomponente.CodTipoComp=? ORDER BY equipo.NombreEq,equipocomponente.codEC",[codTipoComp]);            
        }else{
            result = await connection.query("SELECT equipocomponente.codEC,equipo.NombreEq,laboratorio.NroLab,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN equipocomponente ON equipocomponente.CodComp=componente.CodComp INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq INNER JOIN detalleitem ON equipocomponente.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=equipo.NroLab INNER JOIN marca ON marca.CodMar=equipocomponente.CodMar WHERE equipocomponente.Estado='Activo' AND tipocomponente.CodTipoComp=? AND equipo.NroLab=? ORDER BY equipo.NombreEq,equipocomponente.codEC",[codTipoComp,lab]);            
        }
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }


  //Añadir componente a equipo
  const addComponenteAequipo= async (req,res)=>{
    try {
        const datos = req.body;
      let { fecha,id } = datos.formEq;
     
        const connection = await getConnection();
        const rescatarNombreEq = await connection.query("SELECT * FROM equipo WHERE idEq=?",[id]);//continuar hay errores
        
        const altaeq = await connection.query("INSERT INTO altaequipo(FechaAlta, idEq, NombreEq, NroLab) VALUES (?,?,?,?)",[fecha,id,rescatarNombreEq[0].NombreEq,rescatarNombreEq[0].NroLab]);
              
        //addcomponente
//rescato cod alta
const rescatarIdAlta = await connection.query("SELECT max(IdAlta)as Id FROM altaequipo");

        const promises = Object.values(datos.newInputValues).map(async(dato)=>{
            const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[dato[0],[fecha],dato[1]]);
            
            //rescato idEq
            //console.log(rescatarIdAlta[0].IdAlta);
            const verifEqComp = await connection.query("SELECT * FROM equipocomponente WHERE idEq=? AND CodComp=? AND Estado='Activo'",[id,dato[0]]);
            if(Object.keys(verifEqComp).length>0){

            }
                const insertEqComp = await connection.query("CALL spInsertarEquipoComponente(?,?,'Activo',?)",[[id],dato[0],dato[2]]);
                const rescatarCodEC = await connection.query("SELECT codEC FROM equipocomponente WHERE idEq=? AND CodComp=? AND Estado='Activo'",[id,dato[0]]);
            
                const detalleAlta = await connection.query("INSERT INTO detallealtaequipo(IdAlta, codEC, idEq, CodComp, Estado, CodMar) VALUES (?,?,?,?,?,?)",[rescatarIdAlta[0].Id,rescatarCodEC[0].codEC,id,dato[0],'Activo',dato[2]]);
            
        })
        //const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[codComp,codTipoComp]);
        //eqComp
        await Promise.all(promises);
        const listaEqComp = await connection.query("SELECT detallealtaequipo.codEC,detallealtaequipo.idEq,detallealtaequipo.CodComp,detallealtaequipo.Estado,detallealtaequipo.CodMar,altaequipo.NombreEq,tipocomponente.DescripCo FROM detallealtaequipo LEFT JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta LEFT JOIN componente ON componente.CodComp=detallealtaequipo.CodComp LEFT JOIN tipocomponente ON tipocomponente.CodTipoComp=componente.CodTipoComp WHERE altaequipo.IdAlta=?",[rescatarIdAlta[0].Id]);
        //console.log(Object.values(datos.newInputValues));
        res.json(listaEqComp);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    addEquipo,
  getEquipoComponente,
  addEquipoComponente,
  getEquipoExiste,
  getComponenteExiste,
  GenerarReportePorComponente,
  addComponenteAequipo
}