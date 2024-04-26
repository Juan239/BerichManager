import { pool } from "../db.js";

export const ordenesPorEstablecimiento = async (req, res) => {
    try {
        const mes = req.params.mes;

        // Construimos la consulta SQL con la condición de mes
        let query = `
            SELECT e.est_nombre AS nombre, COUNT(ot.ot_id) AS total
            FROM daem_establecimientos e
            INNER JOIN daem_ordenestrabajo ot ON e.est_id = ot.ot_establecimiento
            WHERE MONTH(ot.ot_fecha) = ? 
            GROUP BY e.est_id, e.est_nombre;
        `;

        // Ejecutamos la consulta con el parámetro de mes
        const result = await pool.query(query, [mes]);

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
