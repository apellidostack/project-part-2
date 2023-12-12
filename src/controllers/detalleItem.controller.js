import { getConnection } from "../database/database";

const setDetalleItem= async (req,res)=>{
    try {
        const valores = req.body.inputValues;
        const unid=req.body.unidades;

  
  // Itera sobre las propiedades de unid
  for (const clave in unid) {
    // Verifica si la propiedad también existe en valores
    if (valores.hasOwnProperty(clave)) {
      // Concatena el valor de unid a la propiedad correspondiente en valores
      valores[clave] += unid[clave];
    }
  }
  
  // Muestra el resultado
  console.log(valores);

        const connection = await getConnection();
        const promises = Object.entries(valores).map(async(datos)=>{
            let xd = datos[0].split('/');
            const result = await connection.query("CALL spInsertarDetalleItem(?,?,?)",[xd[0],xd[3],datos[1]]);
            //console.log(datos[1]);
        })
        //const result = await connection.query("CALL spDetalleDeEquipo(?)",[equipoSeleccionado]);
        await Promise.all(promises);
        res.json("ok");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}


const updateValor= async (req,res)=>{
    try {
      const { valor } = req.body.formData;
      
      const codigos=req.body.datosUpv;
      
      const codVec=codigos.split('/');
        const connection = await getConnection();
        const result = await connection.query("UPDATE detalleitem SET Valor=? WHERE detalleitem.codEC=? AND detalleitem.CodItem=?",[valor,codVec[0],codVec[1]]);
        //console.log(codVec[1]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
  setDetalleItem,
  updateValor
}