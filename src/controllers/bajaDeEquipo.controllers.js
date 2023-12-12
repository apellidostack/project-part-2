import { getConnection } from "../database/database";


//motivo de baja de equipo
const setMotivoBajaEquipo= async (req,res)=>{
    try {
        const { motivo } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO motivobaja(DescripMot) VALUES (?)",[motivo]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }

  const getMotivoBajaEquipo= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM motivobaja");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
  }

//equipos para solicitudes
const getEquiposParaSolicitarBaja= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const idEquipo = await connection.query("SELECT * FROM equipo WHERE NroLab=? AND Estado='Activo'",[lab]);
        //console.log(lab);
        let equiposDisponibles=[];
        const promises = Object.values(idEquipo).map(async(datos)=>{
            
            //console.log(idDeMaquina[0]);ALGORITMO PERFECTO XD
            const result = await connection.query("SELECT COUNT(*) as num FROM detallebajaequipo INNER JOIN bajaequipo ON detallebajaequipo.CodBaja=bajaequipo.CodBaja WHERE detallebajaequipo.idEq=? AND bajaequipo.Estado='Pendiente'",[datos.idEq]);
            const result2 = await connection.query("SELECT COUNT(*) as num FROM detallebajaequipo INNER JOIN bajaequipo ON detallebajaequipo.CodBaja=bajaequipo.CodBaja WHERE detallebajaequipo.idEq=? AND bajaequipo.Estado='autorizada'",[datos.idEq]);
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
const setBajaEquipo= async (req,res)=>{
    try {
        const datosSoli = req.body;
        const { numLab,motivo }=datosSoli.formDataLabs;
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
        //console.log(fechaYhoraActual);
        const insertBaja = await connection.query("INSERT INTO bajaequipo(FechaSol, Estado, CodMot, Ejecutor) VALUES (?,?,?,?)",[fechaYhoraActual,'Pendiente',motivo,datosSoli.codPer.nombre]);
        const idBaja = await connection.query("SELECT MAX(CodBaja)AS idBaja FROM bajaequipo");
        //QUITE RELACION CON PERSONAL
        //const insertBajaEqPersonal = await connection.query("INSERT INTO bajaeqpersonal(Rol, CodBaja, CodPer) VALUES (?,?,?)",['Solicitante',idBaja[0].idBaja,datosSoli.codPer]);//CONTINUAR BAJA DE EQUIPO DESDE AQUI
//QUITAMOS MOVIMIENTOEQLAB
        //const insertmovEqLab = await connection.query("INSERT INTO movimientoeqlab(CodMov, NroLab,Tipo) VALUES (?,?,'anterior')",[idMov[0].idMov, numLab]);
        //const insertmovEqLab2 = await connection.query("INSERT INTO movimientoeqlab(CodMov, NroLab,Tipo) VALUES (?,?,'nuevo')",[idMov[0].idMov, labDestino]);
        //if(Object.keys(idSol).length > 0){
            const promises = Object.entries(datosSoli.clicados).map(async(datos)=>{
                //let auxEn=datos[0].split('/')
                const result = await connection.query("INSERT INTO detallebajaequipo(CodBaja, idEq) VALUES (?,?)",[idBaja[0].idBaja,datos[1]]);//aqui puede ser clicados si no se coloca un nombre xdddd
                //console.log(datos[1]);
            })
            //const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
            await Promise.all(promises);
        //}
        //console.log(datosSoli.codPer);
        //console.log(res);
        res.json('Solicitud Registrada Correctamente');
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//autorizar baja de equipo

const getListaBajaEqPendientes= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodBaja AS id, FechaSol, Estado, Ejecutor, Autorizador, CodMot FROM bajaequipo WHERE bajaequipo.Estado='Pendiente'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//lista de detalle de mov por codmov

const getDetalleBajaEquipo= async (req,res)=>{
    try {
        const { cod } = req.body;
        const connection = await getConnection();
        const detalleMov = await connection.query("SELECT detallebajaequipo.CodBaja, detallebajaequipo.idEq,equipo.NombreEq,equipo.NroLab FROM detallebajaequipo INNER JOIN equipo ON equipo.idEq=detallebajaequipo.idEq WHERE detallebajaequipo.CodBaja=?",[cod]);
        const labMov = await connection.query("SELECT * FROM bajaequipo WHERE CodBaja=?",[cod]);
        const personalMov = await connection.query("SELECT * FROM bajaequipo WHERE CodBaja=?",[cod]);
        //console.log(lab);
        res.json({detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateAutorizarBajaEquipo= async (req,res)=>{
    try {
        const datosAutorizacion = req.body;
        const codPer=datosAutorizacion.codPer.nombre;
        const connection = await getConnection();
        const vec=datosAutorizacion.autorizar.split('/');
        const detalleMov = await connection.query("UPDATE bajaequipo SET Autorizador=?,Estado=? WHERE CodBaja=?",[codPer,vec[1],vec[0]]);
        //const insertmovEqPersonal = await connection.query("INSERT INTO bajaeqpersonal(Rol, CodBaja, CodPer) VALUES (?,?,?)",['Autorizador',vec[0],codPer]);
        //console.log(lab);
        res.json(detalleMov);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//aumentar desde aqui XDDDDD

const getListaBajaEquipoAutorizadas= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT CodBaja AS id, FechaSol, Estado, Ejecutor, Autorizador, CodMot FROM bajaequipo WHERE bajaequipo.Estado='Autorizada'");
        //console.log(lab);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


//realizar movimiento
const RealizarBaja= async (req,res)=>{
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
        const connection = await getConnection();
        //const repetido=await connection.query("SELECT * FROM equipocomponente WHERE idEq=?",[lab+'-'+nombreEq]);
        
        //addcomponente
        
        const promises0 = Object.values(xd.detalleMov).map(async (dato) => {
            const eqcomp = await connection.query("SELECT * FROM equipocomponente WHERE equipocomponente.idEq=?", [dato.idEq]);
        
            const insertPromises = eqcomp.map(async (d) => {
                //console.log(d[0]);
                await connection.query("INSERT INTO historialbajaequipo(CodBaja, codEC, idEq, CodComp, Estado, CodMar) VALUES (?,?,?,?,?,?)", [dato.CodBaja, d.codEC, d.idEq, d.CodComp, 'Baja', d.CodMar]);
            });
        
            await Promise.all(insertPromises);
        });
        
        await Promise.all(promises0);
        

        const promises = Object.values(xd.detalleMov).map(async(dato)=>{
            const result = await connection.query("UPDATE equipo SET Estado=? WHERE idEq=?",['Baja',dato.idEq]);
            //rescato idEq
            const updateMovEq = await connection.query("UPDATE bajaequipo SET FechaEjec=?,Estado=? WHERE CodBaja=?",[fechaYhoraActual,'Realizado',dato.CodBaja]);
            //
            const bajaEqComp = await connection.query("UPDATE equipocomponente SET Estado=? WHERE equipocomponente.idEq=?",['Baja Equipo',dato.idEq]);
            
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

// reporte historico de movimientos de equipos POR SIACASO MODIFICAR CUANDO HAGA LOS REPORTES XD
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
        const personalMov = await connection.query("SELECT concat(personal.Nombre,' ',personal.Paterno,' ',personal.Materno)AS nombre,movimientoeq.fechaSol FROM movimientoeqpersonal INNER JOIN personal ON personal.CodPer=movimientoeqpersonal.CodPer INNER JOIN movimientoeq ON movimientoeq.CodMov=movimientoeqpersonal.CodMov WHERE movimientoeqpersonal.CodMov=?",[cod]);
        //xd
        res.json({resultAnterior,resultPosterior,detalleMov,labMov,personalMov});
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



export const methods = {
    setMotivoBajaEquipo,
    getMotivoBajaEquipo,
    getEquiposParaSolicitarBaja,
    setBajaEquipo,
    getListaBajaEqPendientes,
    getDetalleBajaEquipo,
    updateAutorizarBajaEquipo,
    getListaBajaEquipoAutorizadas,
    RealizarBaja
}