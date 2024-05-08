import { pool } from "../../db.js";

export const obtenerVehiculos = async (req, res) => {
  const [result] = await pool.query("SELECT * FROM daem_vehiculos");
  res.json(result);
};

export const crearVehiculo = async (req, res) => {
  const { patente, marca, modelo } = req.body;

  const [validarPatente] = await pool.query(
    "SELECT * FROM daem_vehiculos WHERE ve_patente = ?",
    patente
  );

  if (validarPatente.length > 0) {
    console.log("Ya existe un vehiculo con la misma patente");
    return res.status(400).json({
      message: "Ya existe un vehiculo con la misma patente",
    });
  } else {
    const [rows] = await pool.query(
      "INSERT INTO daem_vehiculos(ve_patente, ve_marca, ve_modelo) VALUES (?, ?, ?)",
      [patente, marca, modelo]
    );

    res.sendStatus(204);
  }
};

export const eliminarVehiculo = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM daem_vehiculos WHERE ve_patente = ?",
    req.params.id
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Vehiculo no eliminado",
    });
  else return res.sendStatus(204);
};

export const obtenerVehiculoPorId = async (req, res) => {
  const [result] = await pool.query(
    "SELECT * FROM daem_vehiculos WHERE ve_patente = ?",
    req.params.id
  );
  if (result.length <= 0)
    return res.status(404).json({
      message: "Vehiculo no encontrado",
    });
  else return res.json(result[0]);
};

export const actualizarVehiculo = async (req, res) => {
  const [result] = await pool.query(
    "UPDATE daem_vehiculos SET ve_marca = ?, ve_modelo = ? WHERE ve_patente = ?",
    [req.body.marca, req.body.modelo, req.params.id]
  );
  if (result.affectedRows <= 0)
    return res.status(404).json({
      message: "Vehiculo no actualizado",
    });
  else return res.sendStatus(204);
};
