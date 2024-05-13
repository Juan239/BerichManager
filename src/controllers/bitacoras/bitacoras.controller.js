import { pool } from "../../db.js";

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
    const { fechaLlegada, horaLlegada, kilometrajeLlegada, combustible, observaciones} = req.body;
    
    const [result] = await pool.query(
        "UPDATE daem_bitacoras SET bi_fechallegada = ?, bi_horallegada = ?, bi_kilometrajellegada = ?, bi_combustible = ?, bi_observaciones = ?, bi_estado = 'Completado' WHERE bi_id = ?",
        [fechaLlegada, horaLlegada, kilometrajeLlegada, combustible, observaciones, id]
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
            id
        ]
    );
    if (result.affectedRows === 0)
        return res.status(404).json({ message: "Viaje no encontrado" });
    else {
        return res.status(200).json({ message: "Viaje actualizado correctamente" });
    }
}

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
}

export const obtenerViajePorId = async (req, res) => {
    const id = req.params.id;
    const [result] = await pool.query("SELECT * FROM daem_bitacoras WHERE bi_id = ?", id)
    res.json(result);
}