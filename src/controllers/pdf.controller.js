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
  const responsable = rows[0].nombre;
  const establecimiento = rows[0].establecimiento;
  const intervencion = rows[0].intervencion;
  const descripcion = rows[0].descripcion;
  const observaciones = rows[0].observaciones;

  // Crear un documento PDF en tamaño carta y ajustando los margenes a 50
  const doc = new PDFDocument({ size: "letter", margin: 50 });

  // Agregar logo
  doc.image("./src/images/logoMunicipalidad.jpeg", 50, 30, { width: 50 });

  // Agregar la fecha
  doc.text(`${fecha}`, { align: "right" });
  doc.moveDown();

  // Agregar el titulo al documento
  doc
    .fontSize(20)
    .text(`Orden de Trabajo N°${numeroFolio}`, { align: "center" });

  //Linea debajo del titulo
  doc
    .strokeColor("#000000")
    .lineWidth(1)
    .moveTo(50, 115)
    .lineTo(560, 115)
    .strokeOpacity(1)
    .stroke();

  doc.moveDown();
  // Agregar el contenido del PDF
  doc.fontSize(12);
  //Nombre del establecimiento
  doc.font("Helvetica-Bold").text(`${establecimiento}`);
  doc.font("Helvetica");
  doc.moveDown();
  //Nombre del responsable de la orden
  doc.text(`Responsable: ${responsable}`);
  //Nombre de la intervencion
  const intervencionLineY = doc.y + 18;
  doc.text(`Intervención: ${intervencion}`);
  // Dibujar la línea debajo de la intervención
  doc
    .strokeColor("#212121")
    .lineWidth(0.5)
    .moveTo(50, intervencionLineY)
    .lineTo(560, intervencionLineY)
    .strokeOpacity(0.5)
    .stroke();
  doc.moveDown();
  //Descripcion de la orden
  doc.font("Helvetica-Bold").text(`Descripción`);
  doc.font("Helvetica");
  const descY = doc.y;
  doc.text(`${descripcion}`, { align: "justify" });
  // Calcula y dibuja la línea debajo de la descripción
  const descLineY = descY + doc.heightOfString(descripcion) + 5;
  doc
    .strokeColor("#212121")
    .lineWidth(0.5)
    .moveTo(50, descLineY)
    .lineTo(560, descLineY)
    .strokeOpacity(0.5)
    .stroke();
  doc.moveDown();
  //Observaciones de la orden
  doc.font("Helvetica-Bold").text(`Observaciones`);
  doc.font("Helvetica");
  doc.text(`${observaciones}`, { align: "justify" });

  //Lineas de las firmas
  doc
    .strokeColor("#000000")
    .lineWidth(2)
    .moveTo(60, doc.page.height - 110)
    .lineTo(210, doc.page.height - 110)
    .strokeOpacity(1)
    .stroke();

  doc
    .strokeColor("#000000")
    .lineWidth(2)
    .moveTo(340, doc.page.height - 110)
    .lineTo(570, doc.page.height - 110)
    .stroke();

  // Agregar el texto "Firma" en una posición fija
  const firmaY = doc.page.height - 100;
  doc.text("Firma emisor", 100, firmaY);
  doc.text("Firma responsable establecimiento", 350, firmaY, {
    align: "center",
  });


  // Nombre del archivo PDF
  const pdfName = `Orden_Trabajo_${numeroFolio}.pdf`;
  // Establecer el encabezado Content-Disposition



  // Crea un buffer para almacenar los datos del PDF
  let pdfBuffer = Buffer.from([]);
  doc.on("data", (chunk) => {
    pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
  });
  doc.on("end", () => {
    // Envía el PDF al frontend como respuesta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdfName}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  });

  // Finaliza el documento
  doc.end();
};
