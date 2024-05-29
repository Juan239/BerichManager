import ExcelJS from 'exceljs';
import {guardarBitacorasExcel} from './bitacoras.controller.js'

export const uploadAndReadExcel = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
    
        const worksheet = workbook.getWorksheet(1);
        const data = [];
    
        // Obtener los encabezados de la fila 2
        const headers = worksheet.getRow(2).values;
    
        // Crear un objeto de mapeo para los nombres personalizados
        const nameMapping = {
            'N° Registro' : 'id',
            'Rut conductor': 'conductor',
            'Fecha de salida': 'fechaSalida',
            'Hora de salida': 'horaSalida',
            'Kilometraje de salida': 'kilometrajeSalida',
            'Destino': 'destino',
            'Funcionario trasladado': 'funcionarioTrasladado',
            'Fecha de llegada': 'fechaLlegada',
            'Hora de llegada': 'horaLlegada',
            'Kilometraje de llegada': 'kilometrajeLlegada',
            'Combustible': 'combustible',
            'Observaciones': 'observaciones',
            'Vehículo': 'vehiculo'
        };
    
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber < 3) return; // Saltar las primeras 3 filas
    
            const viaje = {};
            row.values.forEach((value, colNumber) => {
                if (colNumber > 0) { // Saltar el índice 0, ya que ExcelJS agrega un índice vacío al inicio
                    // Comprobar si el valor es una fecha y el encabezado es 'Hora de salida' o 'Hora de llegada'
                    if (value instanceof Date && (headers[colNumber] === 'Hora de salida' || headers[colNumber] === 'Hora de llegada')) {
                        // Convertir la fecha a una cadena de tiempo
                        value = value.toISOString().split('T')[1].substring(0, 8);
                    }
                    // Usar el nombre personalizado si existe, de lo contrario usar el nombre del encabezado
                    const key = nameMapping[headers[colNumber]] || headers[colNumber];
                    viaje[key] = value;
                }
            });
            data.push(viaje);
           // console.log(viaje);
        });
        
        guardarBitacorasExcel(req, res, data);
        
    } catch (err) {
        res.status(500).json({ error: 'Error leyendo el archivo' });
    }
};