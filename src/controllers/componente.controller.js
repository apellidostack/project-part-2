import { getConnection } from "../database/database";

const addComponente= async (req,res)=>{
    try {
      const { codComp,codTipoComp } = req.body;
        const connection = await getConnection();
        const result = await connection.query("CALL spNewComponent(?,'Activo',?)",[codComp,codTipoComp]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}




export const methods = {
  addComponente
}