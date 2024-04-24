import { pool } from "../db.js";
import PDFDocument from "pdfkit";

export const generarPDF = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT ot_id, daem_ordenesTrabajo.ot_fecha AS "fecha", daem_categorias.cat_nombre AS "titulo", CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) AS "nombre", daem_establecimientos.est_nombre AS "establecimiento" , daem_intervenciones.int_nombre AS "intervencion", daem_ordenestrabajo.ot_descripcion as "descripcion", daem_ordenestrabajo.ot_observaciones as "observaciones" FROM daem_ordenesTrabajo INNER JOIN daem_usuarios ON daem_ordenesTrabajo.ot_responsable = daem_usuarios.usr_id INNER JOIN daem_establecimientos ON daem_ordenesTrabajo.ot_establecimiento = daem_establecimientos.est_id INNER JOIN daem_intervenciones ON daem_ordenesTrabajo.ot_intervencion = daem_intervenciones.int_id INNER JOIN daem_categorias ON daem_ordenestrabajo.ot_titulo = daem_categorias.cat_id WHERE ot_id = ?',
    req.params.id
  );

  const numeroFolio = rows[0].ot_id;
  const fecha = new Date(rows[0].fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const titulo = rows[0].titulo;
  const responsable = rows[0].nombre;
  const establecimiento = rows[0].establecimiento;
  const intervencion = rows[0].intervencion;
  const descripcion = rows[0].descripcion;
  const observaciones = rows[0].observaciones;

  const doc = new PDFDocument({ size: 'letter', margin: 50 });

  // Agrega un título al documento
  doc.fontSize(20).text(`Orden de Trabajo N°${numeroFolio}`, { align: 'center' });

  // Agrega una línea divisoria
  doc.moveDown().lineWidth(1).strokeColor('#000').moveDown();

  // Agrega el contenido del PDF
  doc.fontSize(12);
  doc.moveDown();
  doc.text(`Fecha: ${fecha}`);
  doc.moveDown();
  doc.text(`Título: ${titulo}`);
  doc.moveDown();
  doc.text(`Responsable: ${responsable}`);
  doc.moveDown();
  doc.text(`Establecimiento: ${establecimiento}`);
  doc.moveDown();
  doc.text(`Intervención: ${intervencion}`);
  doc.moveDown();
  doc.text(`Descripción: ${descripcion}`);
  doc.moveDown();
  doc.text(`Observaciones: ${observaciones}`);

  // Crea un buffer para almacenar los datos del PDF
  let pdfBuffer = Buffer.from([]);
  doc.on("data", chunk => {
    pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
  });
  doc.on("end", () => {
    // Envía el PDF al frontend como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  });

  // Finaliza el documento
  doc.end();
};
