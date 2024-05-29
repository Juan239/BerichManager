import { pool } from "../../db.js";

export const obtenerParadas = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM daem_paradas");
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerParadaDeViaje = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query(
      'SELECT pa_id, CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) as conductor, pa_fechaSalida, pa_kilometrajeSalida, daem_destinos.de_nombre as destino, pa_fechaLlegada FROM daem_paradas INNER JOIN daem_usuarios ON daem_paradas.pa_conductor = daem_usuarios.usr_id INNER JOIN daem_destinos ON daem_paradas.pa_destino = daem_destinos.de_id WHERE pa_idViaje = ?',
      [id]
    );
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerParadaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query(
      "SELECT * FROM daem_paradas WHERE pa_id = ?",
      [id]
    );
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

}

export const crearParada = async (req, res) => {
  try {
    const {
      viaje,
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
      "INSERT INTO daem_paradas (pa_idViaje, pa_conductor, pa_fechasalida, pa_horasalida, pa_kilometrajesalida, pa_destino, pa_funcionariotrasladado, pa_vehiculo, pa_fechallegada, pa_horallegada, pa_kilometrajellegada, pa_combustible, pa_observaciones) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        viaje,
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
      ]
    );
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarParada = async (req, res) => {
    try {
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
        "UPDATE daem_paradas SET pa_conductor = ?, pa_fechasalida = ?, pa_horasalida = ?, pa_kilometrajesalida = ?, pa_destino = ?, pa_funcionariotrasladado = ?, pa_vehiculo = ?, pa_fechallegada = ?, pa_horallegada = ?, pa_kilometrajellegada = ?, pa_combustible = ?, pa_observaciones = ? WHERE pa_id = ?",
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
        res.json(result);
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const eliminarParada = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query(
      "DELETE FROM daem_paradas WHERE pa_id = ?",
      [id]
    );
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
