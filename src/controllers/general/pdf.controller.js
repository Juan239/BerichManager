import { pool } from "../../db.js";
import PDFDocument from "pdfkit";

export const generarPDFordenTrabajo = async (req, res) => {

    console.log("PDF Creado de orden de trabajo");
    const [rows] = await pool.query(
      'SELECT ot_id, daem_ordenestrabajo.ot_fecha AS "fecha", daem_categorias.cat_nombre AS "titulo", CONCAT(responsable.usr_nombre, " ", responsable.usr_apellido) AS "nombre", daem_establecimientos.est_nombre AS "establecimiento", daem_intervenciones.int_nombre AS "intervencion", daem_ordenestrabajo.ot_descripcion AS "descripcion", daem_ordenestrabajo.ot_observaciones AS "observaciones", CONCAT(colaborador.usr_nombre, " ", colaborador.usr_apellido) AS "colaborador" FROM daem_ordenestrabajo INNER JOIN daem_usuarios AS responsable ON daem_ordenestrabajo.ot_responsable = responsable.usr_id INNER JOIN daem_establecimientos ON daem_ordenestrabajo.ot_establecimiento = daem_establecimientos.est_id INNER JOIN daem_intervenciones ON daem_ordenestrabajo.ot_intervencion = daem_intervenciones.int_id INNER JOIN daem_categorias ON daem_ordenestrabajo.ot_titulo = daem_categorias.cat_id LEFT JOIN daem_usuarios AS colaborador ON daem_ordenestrabajo.ot_colaborador = colaborador.usr_id WHERE ot_id = ?;',
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
    const colaborador = rows[0].colaborador;

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
    if(colaborador === null){
      doc.text(`Responsable: ${responsable}`);
    }
    else{
      doc.text(`Responsables: ${responsable} y ${colaborador}`);
    }
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
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      res.send(pdfBuffer);
    });

    // Finaliza el documento
    doc.end();
};

export const generarPDFbajaEquipos = async (req, res) => {
    console.log("PDF Creado de baja de equipos");
    const [rows] = await pool.query(
      'SELECT be_id, be_fecha AS "fecha", daem_tipoactivos.ac_nombre AS "tipoActivo", daem_marcas.ma_nombre AS "marca", be_modelo AS "modelo", daem_establecimientos.est_nombre AS "ubicacion", CONCAT(daem_usuarios.usr_nombre, " ", daem_usuarios.usr_apellido) AS "responsable", be_relacionSolicitud AS "relacionSolicitud", be_detalle AS "detalle", be_conceptoTecnico AS "conceptoTecnico" FROM daem_bajaEquipos INNER JOIN daem_marcas on daem_bajaEquipos.be_marca = daem_marcas.ma_id INNER JOIN daem_tipoactivos on daem_bajaEquipos.be_tipoActivo = daem_tipoactivos.ac_id INNER JOIN daem_establecimientos on daem_bajaequipos.be_ubicacion = daem_establecimientos.est_id INNER JOIN daem_usuarios ON daem_bajaEquipos.be_responsable = daem_usuarios.usr_id WHERE be_id = ?;',
      req.params.id
    );

    const numeroFolio = rows[0].be_id;
    const fecha = new Date(rows[0].fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const tipoActivo = rows[0].tipoActivo;
    const marca = rows[0].marca;
    const modelo = rows[0].modelo;
    const ubicacion = rows[0].ubicacion;
    const responsable = rows[0].responsable;
    const relacionSolicitud = rows[0].relacionSolicitud;
    const detalle = rows[0].detalle;
    const conceptoTecnico = rows[0].conceptoTecnico;

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
      .text(`Informe técnico de baja de activos N°${numeroFolio}`, { align: "center" });

    //Linea debajo del titulo
    doc
      .strokeColor("#000000")
      .lineWidth(1)
      .moveTo(50, 115)

      doc.moveDown();
      // Agregar el contenido del PDF
      doc.fontSize(12);
      // Ubicacion
      doc.font("Helvetica-Bold").text(`${ubicacion}`);
      doc.font("Helvetica");
      doc.moveDown();
      // Tipo de activo, marca y modelo
      doc.text(`Tipo de activo: ${tipoActivo}`);
      doc.text(`Marca: ${marca}`);
      doc.text(`Modelo: ${modelo}`);
      doc.text(`Responsable: ${responsable}`);
      const ubicacionLineY = doc.y + 5;
      // Dibujar la línea debajo de la ubicación
      doc
        .strokeColor("#212121")
        .lineWidth(0.5)
        .moveTo(50, ubicacionLineY)
        .lineTo(560, ubicacionLineY)
        .strokeOpacity(0.5)
        .stroke();
      doc.moveDown();
      // Responsable
      // Relación de solicitud
      // Relación de solicitud
      doc.font("Helvetica-Bold").text(`Relación de Solicitud`);
      doc.font("Helvetica");
      const relacionSolicitudY = doc.y;
      doc.text(`${relacionSolicitud}`, { align: "justify" });
      // Calcula y dibuja la línea debajo de la relación de solicitud
      const relacionSolicitudLineY = relacionSolicitudY + doc.heightOfString(relacionSolicitud) + 5;
      doc
        .strokeColor("#212121")
        .lineWidth(0.5)
        .moveTo(50, relacionSolicitudLineY)
        .lineTo(560, relacionSolicitudLineY)
        .strokeOpacity(0.5)
        .stroke();
      doc.moveDown();
      // Detalle
      doc.font("Helvetica-Bold").text(`Detalle`);
      doc.font("Helvetica");
      const detalleY = doc.y;
      doc.text(`${detalle}`, { align: "justify" });
      // Calcula y dibuja la línea debajo del detalle
      const detalleLineY = detalleY + doc.heightOfString(detalle) + 5;
      doc
        .strokeColor("#212121")
        .lineWidth(0.5)
        .moveTo(50, detalleLineY)
        .lineTo(560, detalleLineY)
        .strokeOpacity(0.5)
        .stroke();
      doc.moveDown();
      // Concepto técnico
      doc.font("Helvetica-Bold").text(`Concepto Técnico`);
      doc.font("Helvetica");
      doc.text(`${conceptoTecnico}`, { align: "justify" });

      //--------------------Lineas de las firmas------------------
      doc
        .strokeColor("#000000")
        .lineWidth(2)
        .moveTo(60, doc.page.height - 180)
        .lineTo(210, doc.page.height - 180)
        .strokeOpacity(1)
        .stroke();

      doc
        .strokeColor("#000000")
        .lineWidth(2)
        .moveTo(355, doc.page.height - 180)
        .lineTo(555, doc.page.height - 180)
        .stroke();

      // Agregar el texto "Firma" en una posición fija
      const firmaY = doc.page.height - 170;
      doc.text("Firma emisor", 100, firmaY);
      doc.text("Firma de director de área", 350, firmaY, {
        align: "center",
      });

      // Nueva firma
      doc
        .strokeColor("#000000")
        .lineWidth(2)
        .moveTo(190, doc.page.height - 90)
        .lineTo(410, doc.page.height - 90)
        .stroke();

      doc.text("Firma responsable establecimiento", 40, doc.page.height - 80, {
        align: "center",
      });

      // Nombre del archivo PDF
      const pdfName = `Baja_Equipo_${numeroFolio}.pdf`;
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
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

        res.send(pdfBuffer);
      });

      // Finaliza el documento
      doc.end();
    
}
