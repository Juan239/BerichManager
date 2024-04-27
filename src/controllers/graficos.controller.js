import { pool } from "../db.js";

export const ordenesPorEstablecimientoMes = async (req, res) => {
  try {
    const mes = req.params.mes;
    const year = "2024";

    let query;

    //Total de los datos
    if (mes === "0" && year === "0") {
      query = `
                SELECT e.est_nombre AS nombre, COUNT(ot.ot_id) AS total
                FROM daem_establecimientos e
                INNER JOIN daem_ordenestrabajo ot ON e.est_id = ot.ot_establecimiento
                GROUP BY e.est_id, e.est_nombre;
            `;
    } else {
      //Datos del año
      if (mes === "0") {
        query = `
                    SELECT e.est_nombre AS nombre, COUNT(ot.ot_id) AS total
                    FROM daem_establecimientos e
                    INNER JOIN daem_ordenestrabajo ot ON e.est_id = ot.ot_establecimiento
                    WHERE YEAR(ot.ot_fecha) = ? 
                    GROUP BY e.est_id, e.est_nombre;
                `;
      } else {
        //Datos de un año y mes específico
        query = `
                    SELECT e.est_nombre AS nombre, COUNT(ot.ot_id) AS total
                    FROM daem_establecimientos e
                    INNER JOIN daem_ordenestrabajo ot ON e.est_id = ot.ot_establecimiento
                    WHERE YEAR(ot.ot_fecha) = ? AND MONTH(ot.ot_fecha) = ? 
                    GROUP BY e.est_id, e.est_nombre;
                `;
      }
    }

    // Ejecutamos la consulta con el parámetro de mes y año
    const result = await pool.query(query, [year, mes]);

    res.json(result[0]);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const ordenesTrabajoTotal = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT COUNT(ot_id) AS total FROM daem_ordenestrabajo;"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const ordenesTotalesPorMes = async (req, res) => {
    const year = req.params.year;
  try {
    const [result] = await pool.query("SELECT m.mes, COALESCE(COUNT(ot_id), 0) as total FROM (SELECT 1 as mes UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) as m LEFT JOIN daem_ordenestrabajo AS o ON MONTH(o.ot_fecha) = m.mes AND YEAR(o.ot_fecha) = ? GROUP BY m.mes;", year);
    res.json(result);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
