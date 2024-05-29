import { pool } from "../../db.js";
import excel from "exceljs";

export const obtenerBitacoras = async (req, res) => {
  const [result] = await pool.query(
    "SELECT bi_id, daem_usuarios.usr_nombre as conductor, bi_fechasalida, daem_destinos.de_nombre as destino, bi_vehiculo, bi_estado  FROM daem_bitacoras INNER JOIN daem_usuarios ON daem_bitacoras.bi_conductor = daem_usuarios.usr_id INNER JOIN daem_destinos ON daem_bitacoras.bi_destino = daem_destinos.de_id;"
  );
  res.json(result);
};

export const crearViaje = async (req, res) => {
  const {
    conductor,
    fechaSalida,
    horaSalida,
    kilometrajeSalida,
    destino,
    funcionarioTrasladado,
    vehiculo,
  } = req.body;

  const [rows] = await pool.query(
    "INSERT INTO daem_bitacoras(bi_conductor, bi_fechasalida, bi_horasalida, bi_kilometrajesalida, bi_destino, bi_funcionariotrasladado, bi_vehiculo)VALUES (?,?,?,?,?,?,?)",
    [
      conductor,
      fechaSalida,
      horaSalida,
      kilometrajeSalida,
      destino,
      funcionarioTrasladado,
      vehiculo,
    ]
  );
  res.sendStatus(204);
};

export const completarViaje = async (req, res) => {
  const id = req.params.id;
  const {
    fechaLlegada,
    horaLlegada,
    kilometrajeLlegada,
    combustible,
    observaciones,
  } = req.body;

  const [result] = await pool.query(
    "UPDATE daem_bitacoras SET bi_fechallegada = ?, bi_horallegada = ?, bi_kilometrajellegada = ?, bi_combustible = ?, bi_observaciones = ?, bi_estado = 'Completado' WHERE bi_id = ?",
    [
      fechaLlegada,
      horaLlegada,
      kilometrajeLlegada,
      combustible,
      observaciones,
      id,
    ]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Viaje no encontrado" });
  else {
    return res.status(200).json({ message: "Viaje completado correctamente" });
  }
};

export const editarViaje = async (req, res) => {
  const id = req.params.id;
  const {
    conductor,
    fechaSalida,
    horaSalida,
    kilometrajeSalida,
    destino,
    funcionarioTrasladado,
    fechaLlegada,
    horaLlegada,
    kilometrajeLlegada,
    combustible,
    observaciones,
    vehiculo,
  } = req.body;

  const [result] = await pool.query(
    "UPDATE daem_bitacoras SET bi_conductor = ?, bi_fechasalida = ?, bi_horasalida = ?, bi_kilometrajesalida = ?, bi_destino = ?, bi_funcionariotrasladado = ?, bi_vehiculo = ?, bi_fechallegada = ?, bi_horallegada = ?, bi_kilometrajellegada = ?, bi_combustible = ?, bi_observaciones = ? WHERE bi_id = ?",
    [
      conductor,
      fechaSalida,
      horaSalida,
      kilometrajeSalida,
      destino,
      funcionarioTrasladado,
      vehiculo,
      fechaLlegada,
      horaLlegada,
      kilometrajeLlegada,
      combustible,
      observaciones,
      id,
    ]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Viaje no encontrado" });
  else {
    return res.status(200).json({ message: "Viaje actualizado correctamente" });
  }
};

export const eliminarViaje = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM daem_bitacoras WHERE bi_id = ?",
    req.params.id
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Viaje no eliminado",
    });
  else return res.sendStatus(204);
};

export const obtenerViajePorId = async (req, res) => {
  const id = req.params.id;
  const [result] = await pool.query(
    "SELECT * FROM daem_bitacoras WHERE bi_id = ?",
    id
  );
  res.json(result);
};

export const guardarBitacorasExcel = async (req, res, viajes) => {
  var idConductor = [];
  var idDestino = [];

  for (const viaje of viajes) {
    const { conductor, destino, vehiculo } = viaje;

    // Buscar el usr_id del conductor en la tabla daem_usuarios
    const [conductorResult, destinoResult, vehiculoResult] = await Promise.all([
      pool.query("SELECT usr_id FROM daem_usuarios WHERE usr_rut = ?", [
        conductor,
      ]),
      pool.query("SELECT de_id FROM daem_destinos WHERE de_nombre = ?", [
        destino,
      ]),
      pool.query("SELECT ve_patente FROM daem_vehiculos WHERE ve_patente = ?", [
        vehiculo,
      ]),
    ]);

    if (conductorResult[0].length === 0) {
      let conductor = viaje.conductor;
      return res
        .status(404)
        .json({ message: "Conductor no encontrado: " + conductor });
    }

    if (destinoResult[0].length === 0) {
      let destino = viaje.destino;
      return res
        .status(404)
        .json({ message: "Destino no encontrado: " + destino });
    }

    if (vehiculoResult[0].length === 0) {
      let vehiculo = viaje.vehiculo;
      return res
        .status(404)
        .json({ message: "Vehiculo no encontrado: " + vehiculo });
    }
    idConductor.push(conductorResult[0][0].usr_id);
    idDestino.push(destinoResult[0][0].de_id);
  }
  for (const viaje of viajes) {
    const {
      fechaSalida,
      horaSalida,
      kilometrajeSalida,
      funcionarioTrasladado,
      vehiculo,
      fechaLlegada,
      horaLlegada,
      kilometrajeLlegada,
      combustible,
      observaciones,
    } = viaje;

    const [rows] = await pool.query(
      "INSERT INTO daem_bitacoras(bi_conductor, bi_fechasalida, bi_horasalida, bi_kilometrajesalida, bi_destino, bi_funcionariotrasladado, bi_vehiculo, bi_fechallegada, bi_horallegada, bi_kilometrajellegada, bi_combustible, bi_observaciones, bi_estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        idConductor[0],
        fechaSalida,
        horaSalida,
        kilometrajeSalida,
        idDestino[0],
        funcionarioTrasladado,
        vehiculo,
        fechaLlegada,
        horaLlegada,
        kilometrajeLlegada,
        combustible,
        observaciones,
        "Completado",
      ]
    );
    idConductor.shift();
    idDestino.shift();
  }
  // Enviar una respuesta al final del bucle
  return res
    .status(200)
    .json({ message: "Todos los viajes han sido creados correctamente" });
};

export const descargarBitacoras = async (req, res) => {
  const { fechaInicio, fechaFinal, conductor } = req.body;

  let result;
  if (conductor == 0) {
    [result] = await pool.query(
      "SELECT bi_id, daem_usuarios.usr_rut as rut, CONCAT(daem_usuarios.usr_nombre,' ', daem_usuarios.usr_apellido) as nombre, bi_fechasalida, bi_horasalida, bi_kilometrajesalida, daem_destinos.de_nombre as destino, bi_funcionariotrasladado, bi_fechallegada, bi_horallegada, bi_kilometrajellegada, bi_combustible, bi_observaciones, bi_vehiculo FROM daem_bitacoras INNER JOIN daem_usuarios ON daem_bitacoras.bi_conductor = daem_usuarios.usr_id INNER JOIN daem_destinos ON daem_bitacoras.bi_destino = daem_destinos.de_id WHERE bi_fechasalida BETWEEN ? AND ?",
      [fechaInicio, fechaFinal]
    );
  } else {
    [result] = await pool.query(
      "SELECT bi_id, daem_usuarios.usr_rut as rut, CONCAT(daem_usuarios.usr_nombre,' ', daem_usuarios.usr_apellido) as nombre, bi_fechasalida, bi_horasalida, bi_kilometrajesalida, daem_destinos.de_nombre as destino, bi_funcionariotrasladado, bi_fechallegada, bi_horallegada, bi_kilometrajellegada, bi_combustible, bi_observaciones, bi_vehiculo FROM daem_bitacoras INNER JOIN daem_usuarios ON daem_bitacoras.bi_conductor = daem_usuarios.usr_id INNER JOIN daem_destinos ON daem_bitacoras.bi_destino = daem_destinos.de_id WHERE bi_fechasalida BETWEEN ? AND ? AND bi_conductor = ?",
      [fechaInicio, fechaFinal, conductor]
    );
  }

  if (result.length === 0) {
    return res.status(404).json({ message: "No se encontraron resultados" });
  }

  // Crear un nuevo workbook
  const workbook = new excel.Workbook();

  // Agregar una hoja de cálculo
  const worksheet = workbook.addWorksheet('Bitacoras');

  // Escribir los datos en el excel
  worksheet.getCell('B2').value = 'ID';
  worksheet.getCell('C2').value = 'Rut Conductor';
  worksheet.getCell('D2').value = 'Nombre Conductor';
  worksheet.getCell('E2').value = 'Fecha Salida';
  worksheet.getCell('F2').value = 'Hora Salida';
  worksheet.getCell('G2').value = 'Kilometraje Salida';
  worksheet.getCell('H2').value = 'Destino';
  worksheet.getCell('I2').value = 'Funcionario trasladado';
  worksheet.getCell('J2').value = 'Vehículo';
  worksheet.getCell('K2').value = 'Fecha Llegada';
  worksheet.getCell('L2').value = 'Hora Llegada';
  worksheet.getCell('M2').value = 'Kilometraje Llegada';
  worksheet.getCell('N2').value = 'Combustible';
  worksheet.getCell('O2').value = 'Observaciones';

  // Set column widths
  worksheet.getColumn('B').width = 10;
  worksheet.getColumn('C').width = 20;
  worksheet.getColumn('D').width = 20;
  worksheet.getColumn('E').width = 15;
  worksheet.getColumn('F').width = 20;
  worksheet.getColumn('G').width = 20;
  worksheet.getColumn('H').width = 15;
  worksheet.getColumn('I').width = 25;
  worksheet.getColumn('J').width = 15;
  worksheet.getColumn('K').width = 15;
  worksheet.getColumn('L').width = 15;
  worksheet.getColumn('M').width = 20;
  worksheet.getColumn('N').width = 15;
  worksheet.getColumn('O').width = 20;

  let columnas = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  for(let col of columnas){
    worksheet.getCell(`${col}2`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '969696' }
    };
  }


  // Itera sobre las columnas para agregar bordes
  ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'].forEach(col => {
    // Agregar bordes a las celdas de encabezado (fila 1)
    worksheet.getCell(`${col}2`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Itera sobre las filas para agregar bordes a cada celda
    for (let i = 0; i < result.length+1; i++) {
      worksheet.getCell(`${col}${i + 2}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });

  for (let i = 0; i < result.length; i++) {
    const row = result[i];
    worksheet.getCell(`B${i + 3}`).value = row.bi_id;
    worksheet.getCell(`C${i + 3}`).value = row.rut;
    worksheet.getCell(`D${i + 3}`).value = row.nombre;
    worksheet.getCell(`E${i + 3}`).value = row.bi_fechasalida;
    worksheet.getCell(`F${i + 3}`).value = row.bi_horasalida;
    worksheet.getCell(`G${i + 3}`).value = row.bi_kilometrajesalida;
    worksheet.getCell(`H${i + 3}`).value = row.destino;
    worksheet.getCell(`I${i + 3}`).value = row.bi_funcionariotrasladado;
    worksheet.getCell(`J${i + 3}`).value = row.bi_vehiculo;
    worksheet.getCell(`K${i + 3}`).value = row.bi_fechallegada;
    worksheet.getCell(`L${i + 3}`).value = row.bi_horallegada;
    worksheet.getCell(`M${i + 3}`).value = row.bi_kilometrajellegada;
    worksheet.getCell(`N${i + 3}`).value = row.bi_combustible;
    worksheet.getCell(`O${i + 3}`).value = row.bi_observaciones;
    
  }

  // Escribir el workbook en la respuesta
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=bitacoras(${fechaInicio}/${fechaFinal}).xlsx`
  );

  console.log(`Generando Excel de bitacoras desde ${fechaInicio} a ${fechaFinal}`);
  await workbook.xlsx.write(res);
  res.end();
};
