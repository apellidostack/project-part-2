import { getConnection } from "../database/database";

const getLabs= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM laboratorio");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setLabs= async (req,res)=>{
    try {
        const { lab } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO laboratorio(NroLab, GrupoTrabajo) VALUES (?,?)",[lab,lab]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
  getLabs,
  setLabs
}