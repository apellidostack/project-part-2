import { getConnection } from "../database/database";

/*const getnewMotivo= async (req,res)=>{
    try {
        const { motivo } = req.body;
        const connection = await getConnection();
        const result = await connection.query("CALL spNewMotivoSol(?)",[motivo]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getMotivo= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM motivo");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//tipo solicitud
const getTipoSol= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM tiposol");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
*/
//equipos para solicitudes
const getEquiposParaSolicitarMovimiento= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const idEquipo = await connection.query("SELECT * FROM equipo WHERE NroLab=? AND Estado='Activo'",[lab]);
        //console.log(lab);
        let equiposDisponibles=[];
        const promises = Object.values(idEquipo).map(async(datos)=>{
            
            //console.log(idDeMaquina[0]);ALGORITMO PERFECTO XD
            const result = await connection.query("SELECT COUNT(*) as num FROM detallemovimientoeq INNER JOIN movimientoeq ON detallemovimientoeq.CodMov=movimientoeq.CodMov WHERE detallemovimientoeq.idEq=? AND movimientoeq.Estado='Pendiente'",[datos.idEq]);
            const result2 = await connection.query("SELECT COUNT(*) as num FROM detallemovimientoeq INNER JOIN movimientoeq ON detallemovimientoeq.CodMov=movimientoeq.CodMov WHERE detallemovimientoeq.idEq=? AND movimientoeq.Estado='autorizada'",[datos.idEq]);
            console.log(result[0].num);
            if (result[0].num == 0 && result2[0].num == 0) {
                const validado = await connection.query("SELECT * FROM equipo WHERE equipo.idEq=? AND Estado='Activo'", [datos.idEq]);
                
                equiposDisponibles.push(validado[0]);
              }
            //console.log(datos[1]);
        })
        //const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
        await Promise.all(promises);
        
        console.log(equiposDisponibles);
        res.json(equiposDisponibles);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//insertar solicitud
const setMovimientoEq= async (req,res)=>{
    try {
        const datosSoli = req.body;
        const { numLab,labDestino }=datosSoli.formDataLabs;
        const connection = await getConnection();
        // Obtén la fecha actual
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
        const insertMov = await connection.query("INSERT INTO movimientoeq(Estado, FechaSol,labAnterior,NroLab,Ejecutor) VALUES ('Pendiente',?,?,?,?)",[fechaYhoraActual,numLab,labDestino,datosSoli.codPer.nombre]);
        const idMov = await connection.query("SELECT max(CodMov)AS idMov FROM movimientoeq");
        //QUITE MOVPERSONAL CAMBIAR COD PER?
        //const insertmovEqPersonal = await connection.query("INSERT INTO movimientoeqpersonal(CodPer, CodMov, Rol) VALUES (?,?,'Solicitante')",[datosSoli.codPer,idMov[0].idMov]);
//QUITAMOS MOVIMIENTOEQLAB
        //const insertmovEqLab = await connection.query("INSERT INTO movimientoeqlab(CodMov, NroLab,Tipo) VALUES (?,?,'anterior')",[idMov[0].idMov, numLab]);
        //const insertmovEqLab2 = await connection.query("INSERT INTO movimientoeqlab(CodMov, NroLab,Tipo) VALUES (?,?,'nuevo')",[idMov[0].idMov, labDestino]);
        //if(Object.keys(idSol).length > 0){
            const promises = Object.entries(datosSoli.formData).map(async(datos)=>{
                let auxEn=datos[0].split('/')
                const result = await connection.query("INSERT INTO detallemovimientoeq(CodMov, idEq, nomAnterior, nomNuevo) VALUES (?,?,?,?)",[idMov[0].idMov,auxEn[0],auxEn[1],labDestino+'-'+datos[1]]);
                //console.log(datos[1]);
            })
            //const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
            await Promise.all(promises);
        //}
        console.log(datosSoli.codPer.nombre);
        //console.log(res);
        res.json('ok');
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//autorizar movimiento de equipo

const getListaMovEqPendientes= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM movimientoeq WHERE Estado='Pendiente'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//lista de detalle de mov por codmov

const getDetalleMovEq= async (req,res)=>{
    try {
        const { cod } = req.body;
        const connection = await getConnection();
        const detalleMov = await connection.query("SELECT * FROM detallemovimientoeq WHERE detallemovimientoeq.CodMov=?",[cod]);
        const labMov = await connection.query("SELECT * FROM movimientoeq WHERE CodMov=?",[cod]);
        const personalMov = await connection.query("SELECT * FROM movimientoeq WHERE CodMov=?",[cod]);
        //console.log(lab);
        res.json({detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateAutorizarMovEq= async (req,res)=>{
    try {
        const datosAutorizacion = req.body;
        const codPer=datosAutorizacion.codPer.nombre;
        const connection = await getConnection();
        const vec=datosAutorizacion.autorizar.split('/');
        const detalleMov = await connection.query("UPDATE movimientoeq SET Autorizador=?,Estado=? WHERE CodMov=?",[codPer,vec[1],vec[0]]);
        //const insertmovEqPersonal = await connection.query("INSERT INTO movimientoeqpersonal(CodPer, CodMov, Rol) VALUES (?,?,?)",[codPer,vec[0],vec[1]]);
        //console.log(lab);
        res.json(detalleMov);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//aumentar desde aqui

const getListaMovEqAutorizadas= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMov AS id, FechaSol, Estado, Ejecutor, Autorizador FROM movimientoeq WHERE Estado='Autorizada'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


//Movimiento de componentes
//lista de componentes activos
const getListaComponentes= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT equipocomponente.codEC as id,equipo.NombreEq,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,marca.DescripMar FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN equipocomponente ON equipocomponente.CodComp=componente.CodComp INNER JOIN equipo ON equipo.idEq=equipocomponente.idEq INNER JOIN laboratorio ON laboratorio.NroLab=equipo.NroLab INNER JOIN marca ON marca.CodMar=equipocomponente.CodMar WHERE componente.Estado='Activo'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//realizar movimiento
const RealizarMovimiento= async (req,res)=>{
    try {
        
        const xd=req.body.infoMovEq.detalleMov
       console.log(xd.detalleMov);
       //console.log(xd.labMov[0]);
       //const labnuevo=(xd.labMov[0].Tipo=='nuevo')?xd.labMov[0].NroLab:xd.labMov[1].NroLab; 
       const labnuevo=xd.labMov[0].NroLab;

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
       //console.log(labnuevo);
        const connection = await getConnection();
        //const repetido=await connection.query("SELECT * FROM equipocomponente WHERE idEq=?",[lab+'-'+nombreEq]);
        
        //addcomponente
        
        const promises0 = Object.values(xd.detalleMov).map(async (dato) => {
            const eqcomp = await connection.query("SELECT * FROM equipocomponente WHERE equipocomponente.idEq=? AND Estado='Activo'", [dato.idEq]);
        
            const insertPromises = eqcomp.map(async (d) => {
                //console.log(d[0]);
                await connection.query("INSERT INTO historialequiposxcomponentes(CodMov, codEC, idEq, CodComp, Estado, CodMar) VALUES (?,?,?,?,?,?)", [dato.CodMov, d.codEC, d.idEq, d.CodComp, 'Anterior', d.CodMar]);
            });
        
            await Promise.all(insertPromises);
        });
        
        await Promise.all(promises0);
        

        const promises = Object.values(xd.detalleMov).map(async(dato)=>{
            const result = await connection.query("UPDATE equipo SET NombreEq=?,NroLab=? WHERE idEq=?",[dato.nomNuevo,labnuevo,dato.idEq]);
            //rescato idEq
            const updateMovEq = await connection.query("UPDATE movimientoeq SET FechaEjec=?,Estado=? WHERE CodMov=?",[fechaYhoraActual,'Realizado',dato.CodMov]);
            
        })
        //const resultComp = await connection.query("CALL spNewComponent(?,'Activo',?,?)",[codComp,codTipoComp]);
        //eqComp
        await Promise.all(promises);
        
        //console.log(Object.values(datos.newInputValues));
        const promises2 = Object.values(xd.detalleMov).map(async (dato) => {
            const eqcomp = await connection.query("SELECT * FROM equipocomponente WHERE equipocomponente.idEq=?", [dato.idEq]);
        
            const insertPromises = eqcomp.map(async (d) => {
                await connection.query("INSERT INTO historialequiposxcomponentes(CodMov, codEC, idEq, CodComp, Estado, CodMar) VALUES (?,?,?,?,?,?)", [dato.CodMov, d.codEC, d.idEq, d.CodComp, 'Posterior', d.CodMar]);
            });
        
            await Promise.all(insertPromises);
        });
        
        await Promise.all(promises2);
       
        res.json('ok');
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

// reporte historico de movimientos de equipos CAMBIAR LOS REPORTES XD
const geMovimientoEqHistorico= async (req,res)=>{
    try {
        const { cod } = req.body;
        console.log(cod);
        const connection = await getConnection();
        const resultAnterior = await connection.query("CALL spHistorialMovEqAnterior(?)",[cod]);
        const resultPosterior = await connection.query("CALL spHistorialMovEqPosterior(?)",[cod]);
        //console.log(lab);
        const detalleMov = await connection.query("SELECT * FROM detallemovimientoeq WHERE detallemovimientoeq.CodMov=?",[cod]);
        const labMov = await connection.query("SELECT * FROM movimientoeq WHERE CodMov=?",[cod]);
        /*const personalMov = await connection.query("SELECT concat(personal.Nombre,' ',personal.Paterno,' ',personal.Materno)AS nombre,movimientoeq.fechaSol FROM movimientoeqpersonal INNER JOIN personal ON personal.CodPer=movimientoeqpersonal.CodPer INNER JOIN movimientoeq ON movimientoeq.CodMov=movimientoeqpersonal.CodMov WHERE movimientoeqpersonal.CodMov=?",[cod]);
        //xd */
        res.json({resultAnterior,resultPosterior,detalleMov,labMov});
        //res.json({resultAnterior,resultPosterior,detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//lista de movimientos realizados Historico
const getListaMovEqRealizados= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodMov AS id, FechaSol, FechaEjec, Estado, labAnterior, NroLab FROM movimientoeq WHERE Estado='Realizado'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//reporte historico de equipo
const getHIstoricoDeEquipo= async (req,res)=>{
    try {
        const { equipoSeleccionado } = req.body;
        console.log(equipoSeleccionado);
        const connection = await getConnection();
        const result = await connection.query("CALL spHitoricoDeEquipo(?)",[equipoSeleccionado]);
        //xd
        res.json({result});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//MOVIMIENTO DE EQUIPOS POR GESTION
const GetAniosEnMovimientoEquipo= async (req,res)=>{
    try {
        const connection = await getConnection();
        //const result = await connection.query("SELECT altaequipo.FechaAlta,detallealtaequipo.codEC,altaequipo.NombreEq,altaequipo.ip,altaequipo.DirecMac,laboratorio.GrupoTrabajo,tipocomponente.DescripCo,componente.CodComp,detalleitem.CodItem,marca.DescripMar,item.DescripItem,detalleitem.Valor FROM tipocomponente INNER JOIN componente ON componente.CodTipoComp=tipocomponente.CodTipoComp INNER JOIN detallealtaequipo ON detallealtaequipo.CodComp=componente.CodComp INNER JOIN altaequipo ON altaequipo.IdAlta=detallealtaequipo.IdAlta INNER JOIN detalleitem ON detallealtaequipo.codEC=detalleitem.codEC INNER JOIN item ON item.CodItem=detalleitem.CodItem INNER JOIN laboratorio ON laboratorio.NroLab=altaequipo.NroLab INNER JOIN marca ON marca.CodMar=detallealtaequipo.CodMar ORDER BY altaequipo.NombreEq,detallealtaequipo.codEC");
        const result = await connection.query("SELECT DISTINCT date_format(movimientoeq.FechaEjec,'%Y')AS fecha FROM movimientoeq WHERE Estado='Realizado'");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }


  const geMovimientoEqPorGestion = async (req, res) => {
    try {
      const { lab } = req.body;
      const connection = await getConnection();
      const idMovAnual = await connection.query("SELECT movimientoeq.CodMov FROM movimientoeq WHERE Estado='Realizado' AND date_format(movimientoeq.FechaEjec,'%Y')=?", [lab]);
  
      let resultPosterior = {};
      let detalleMov = {};
      let labMov = {};
  
      const insertPromises = idMovAnual.map(async (d) => {
        console.log(d.CodMov);
  
        const result = await connection.query("CALL spHistorialMovEqPosterior(?)", [d.CodMov]);
        resultPosterior[d.CodMov] = result;
  
        const resdetalleMov = await connection.query("SELECT * FROM detallemovimientoeq WHERE detallemovimientoeq.CodMov=?", [d.CodMov]);
        detalleMov[d.CodMov] = resdetalleMov;
  
        const reslabMov = await connection.query("SELECT * FROM movimientoeq WHERE CodMov=?", [d.CodMov]);
        labMov[d.CodMov] = reslabMov;
      });
  
      await Promise.all(insertPromises);
  
      res.json({ resultPosterior, detalleMov, labMov });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  




export const methods = {
    getEquiposParaSolicitarMovimiento,
    setMovimientoEq,
    getListaMovEqPendientes,
    getDetalleMovEq,
    updateAutorizarMovEq,
    getListaMovEqAutorizadas,
    getListaComponentes,
    RealizarMovimiento,
    geMovimientoEqHistorico,
    getListaMovEqRealizados,
    getHIstoricoDeEquipo,
    geMovimientoEqPorGestion,
    GetAniosEnMovimientoEquipo
}