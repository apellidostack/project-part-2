import { getConnection } from "../database/database";

const addPersonal= async (req,res)=>{
    try {
      const { codper,nombre,paterno,materno,correo,telf,dir,fecha,contrasenia,cargo } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO personal(CodPer, Nombre, Paterno, Materno, FechaIng, Dir, Telf, Email, Contrasenia, CodCar) VALUES (?,?,?,?,?,?,?,?,?,?)",[codper,nombre,paterno,materno,fecha,dir,telf,correo,contrasenia,cargo]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getPersonal= async (req,res)=>{
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT personal.CodPer AS id,personal.Nombre,personal.Paterno,personal.Materno,personal.FechaIng,personal.Dir,personal.Telf,personal.Email,cargo.DescripCar FROM personal INNER JOIN cargo ON cargo.CodCar=personal.CodCar");
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const getPersonalParaEditar= async (req,res)=>{
    try {
        const { id } = req.body;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM personal WHERE CodPer=?",[id]);
        //console.log(res);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    addPersonal,
    getPersonal,
    getPersonalParaEditar
}