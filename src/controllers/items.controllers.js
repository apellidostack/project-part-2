import { getConnection } from "../database/database";

const getItems= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM item");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setItems= async (req,res)=>{
    try {
        const { item } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO item(DescripItem) VALUES(?)",[item]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
  getItems,
  setItems
}