import { getConnection } from "../database/database";

const getMarca= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM marca");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
//tipo componente add
const setTipoComponente= async (req,res)=>{
    try {
        const { tipoComp } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO tipocomponente(DescripCo) VALUES (?)",[tipoComp]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//marca add
const setMarca= async (req,res)=>{
    try {
        const { marca } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO marca(DescripMar) VALUES (?)",[marca]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//cargos
const getCargo= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM cargo");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setCargo= async (req,res)=>{
    try {
        const {cargo} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO cargo(DescripCar) VALUES(?)",[cargo]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//motivo de solicitud
const setMotivoSoli= async (req,res)=>{
    try {
        const {motsoli} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO motivo(DescripMotivo) VALUES(?)",[motsoli]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//industria
const getIndustria= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM industria");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setIndustria= async (req,res)=>{
    try {
        const {descripIn} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO industria(DescripInd) VALUES(?)",[descripIn]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//modelo
const getModelo= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM modelo");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setModelo= async (req,res)=>{
    try {
        const {descripMod} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO modelo(Descrip) VALUES(?)",[descripMod]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

//tipo de equipo adicional
const getTipoAd= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM tipoequipoadicional");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setTipoAd= async (req,res)=>{
    try {
        const {descripTipoAd} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO tipoequipoadicional(DescripEqAd) VALUES(?)",[descripTipoAd]);
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}




export const methods = {
    getMarca,
    setTipoComponente,
    setMarca,
    getCargo,
    setCargo,
    setMotivoSoli,
    getIndustria,
    getModelo,
    getTipoAd,
    setIndustria,
    setModelo,
    setTipoAd
}