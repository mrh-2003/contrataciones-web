// src/app/services/excel-export.service.ts
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs'; 
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }
  exportAsExcelFile(data: any[], headers: string[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Postulantes');

    // Añadir encabezado del reporte
    worksheet.addRow([]); // Fila en blanco
    worksheet.getCell('B2').value = fileName;
    worksheet.getCell('B2').font ={
      bold: true,
      size: 12
    };
    // Añadir los encabezados en la fila 2, columna B
    const headerRow = worksheet.addRow([null, ...headers]);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ADD8E6' } // Color celeste
      };
      cell.font = {
        bold: true
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Añadir datos en las filas siguientes, comenzando desde la columna B
    data.forEach((element) => {
      const row = worksheet.addRow([null, ...Object.values(element)]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Ajustar el ancho de las columnas al contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
    });

    // Generar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      this.saveAsExcelFile(buffer, fileName);
    }).catch(err => {
      console.error('Error al escribir el buffer de Excel:', err);
    });
  }

    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(data, `${fileName}.xlsx`);
    }
}