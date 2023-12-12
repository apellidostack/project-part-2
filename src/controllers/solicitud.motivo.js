import { getConnection } from "../database/database";

const getnewMotivo= async (req,res)=>{
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

//equipos para solicitudes
const getEquiposParaReportar= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const idEquipo = await connection.query("SELECT * FROM equipo WHERE NroLab=? AND Estado='Activo'",[lab]);
        //console.log(lab);
        let equiposDisponibles=[];
        const promises = Object.values(idEquipo).map(async(datos)=>{
            
            //console.log(idDeMaquina[0]);ALGORITMO PERFECTO XD
            const result = await connection.query("SELECT COUNT(*) as num FROM incluye INNER JOIN solicitudreporte ON incluye.CodSol=solicitudreporte.CodSol WHERE incluye.idEq=? AND solicitudreporte.Estado='Pendiente'",[datos.idEq]);
            const result2 = await connection.query("SELECT COUNT(*) as num FROM incluye INNER JOIN solicitudreporte ON incluye.CodSol=solicitudreporte.CodSol WHERE incluye.idEq=? AND solicitudreporte.Estado='autorizada'",[datos.idEq]);
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
const setSolicitud= async (req,res)=>{
    try {
        const datosSoli = req.body;
        
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
        
        // Define la cantidad de días que deseas sumar
        const diasASumar = 7;
        
        // Clona la fecha actual para no modificarla directamente
        const fechaFutura = new Date(fechaActual);
        fechaFutura.setDate(fechaActual.getDate() + diasASumar);
        
        // Formatea la fecha futura en el mismo formato "YYYY-MM-DD HH:mm:ss"
        const añoFuturo = fechaFutura.getFullYear();
        const mesFuturo = (fechaFutura.getMonth() + 1).toString().padStart(2, '0');
        const díaFuturo = fechaFutura.getDate().toString().padStart(2, '0');
        const horaFutura = fechaFutura.getHours().toString().padStart(2, '0');
        const minutosFuturo = fechaFutura.getMinutes().toString().padStart(2, '0');
        const segundosFuturo = fechaFutura.getSeconds().toString().padStart(2, '0');
        
        const fechaYhoraFutura = `${añoFuturo}-${mesFuturo}-${díaFuturo} ${horaFutura}:${minutosFuturo}:${segundosFuturo}`;
        
        console.log(fechaYhoraFutura);
        
        /* console.log(fechaHoraCombinada);
        console.log(fechaYhoraActual); */
        const insertSolicitud = await connection.query("INSERT INTO solicitudreporte(Estado, FechaSol, FechaLimite, CodTipoSol,Solicitante) VALUES ('Pendiente',?,?,?,?)",[fechaYhoraActual,fechaYhoraFutura,datosSoli.tipo,datosSoli.codPer.nombre]);
        const idSol = await connection.query("SELECT max(CodSol)AS idsol FROM solicitudreporte");
        //const insertGenera = await connection.query("INSERT INTO genera(CodPer, CodSol, Rol) VALUES (?,?,'Solicitante')",[datosSoli.codPer,idSol[0].idsol]);
        //if(Object.keys(idSol).length > 0){
            const promises = Object.entries(datosSoli.formData).map(async(datos)=>{
                let idDeMaquina=datos[0].split('/')
                //console.log(idDeMaquina[0]);
                const result = await connection.query("INSERT INTO incluye(idEq, CodSol,motivo) VALUES (?,?,?)",[idDeMaquina[0],idSol[0].idsol,datos[1]]);
                //console.log(datos[1]);
            })
            //const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
            await Promise.all(promises);
        //}
        //console.log(datosSoli.codPer);
        //console.log(datosSoli.formData);
        res.json('ok');
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


//equipos para solicitudes
const getDetalleSolicitudMantenimiento= async (req,res)=>{
    try {
        const { cod } = req.body;
        const connection = await getConnection();
        const detalleMov = await connection.query("SELECT incluye.CodSol,equipo.idEq,equipo.NombreEq,equipo.NroLab,solicitudreporte.Solicitante,solicitudreporte.FechaSol,solicitudreporte.FechaLimite,tiposol.DescripTipoSol,incluye.motivo FROM solicitudreporte INNER JOIN incluye ON incluye.CodSol=solicitudreporte.CodSol INNER JOIN equipo ON equipo.idEq=incluye.idEq INNER JOIN tiposol ON tiposol.CodTipoSol=solicitudreporte.CodTipoSol WHERE solicitudreporte.CodSol=?",[cod]);
        const labMov = await connection.query("SELECT * FROM solicitudreporte WHERE CodSol=?",[cod]);
        const personalMov = await connection.query("SELECT * FROM solicitudreporte WHERE CodSol=?",[cod]);
        //console.log(personalMov);
        res.json({detalleMov,labMov,personalMov});
    } catch (error) {
        res.status(500);
            res.send(error.message);
    }
}

const getMantenimientoPendiente= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT solicitudreporte.CodSol AS id, solicitudreporte.Estado, solicitudreporte.FechaSol, solicitudreporte.FechaLimite, solicitudreporte.Solicitante, solicitudreporte.Ejecutor, tiposol.DescripTipoSol FROM solicitudreporte INNER JOIN tiposol ON tiposol.CodTipoSol=solicitudreporte.CodTipoSol WHERE Estado='Pendiente'");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//Atender Solicitud
const setAtenderSolicitud = async (req,res)=>{
    try {
        //throw new Error('Error en la solicitud al servidor');
        const xd=req.body.formData;
        const per=req.body.codPer.nombre
        console.log(per);
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
        //console.log(Object.entries(xd)[0][0]);
        const codigo=Object.entries(xd)[0][0].split('/');
        //console.log(codigo[0]);
        const updateSolicitud = await connection.query("UPDATE solicitudreporte SET Estado=?,FechaEjecucion=?,Ejecutor=? WHERE CodSol=?", ['Realizada',fechaYhoraActual,per,codigo[0]]);
        
        const promises0 = Object.entries(xd).map(async (dato) => {
            const idYCod=dato[0].split('/');
            const eqcomp = await connection.query("UPDATE incluye SET Descripcion=? WHERE idEq=? AND CodSol=?", [dato[1],idYCod[1],idYCod[0]]);
        
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
    getnewMotivo,
    getEquiposParaReportar,
    getMotivo,
    getTipoSol,
    setSolicitud,
    getDetalleSolicitudMantenimiento,
    getMantenimientoPendiente,
    setAtenderSolicitud
}