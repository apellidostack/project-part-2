import { getConnection } from "../database/database";

const getTipoComp= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM tipocomponente");
        //const result = await connection.query("CALL spTipoCOmp()");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    getTipoComp
}