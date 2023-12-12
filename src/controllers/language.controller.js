import { getConnection } from "../database/database";
import jwt from "jsonwebtoken";

const getLogin = async (req, res) => {
    try {
      const { nombre, password } = req.body;
      const connection = await getConnection();
      const result = await connection.query("CALL spLogin(?, ?)", [nombre, password]);
  
      // Comprobar si result[0] contiene datos
      if (!result[0] || result[0].length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      // Convertir el objeto RowDataPacket a un objeto JSON y luego parsearlo para obtener un objeto de JavaScript plano
      const usuario = JSON.parse(JSON.stringify(result[0][0]));
  
      const secretKey = 'tu_secreto'; // Reemplaza 'tu_secreto' con una clave secreta segura
      const options = { expiresIn: '1h' }; // Opcional: Configura la expiración del token (1 hora en este caso)
  
      const token = jwt.sign(usuario, secretKey, options);
  
      // Devuelves el token como respuesta
      res.json({ token,usuario });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }
  

const addLanguage= async (req,res)=>{
    try {
        const {}=req.body;
        const repuestos = {nombre,categoria,precio,marca,freg,cantidad}//nombres de los atributos de la tabla

        const connection = await getConnection();
        const result = await connection.query("INSERT INTO repuesto SET ?", repuestos);
        //console.log(res);
        res.json(result);    
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    getLogin,
    addLanguage
}