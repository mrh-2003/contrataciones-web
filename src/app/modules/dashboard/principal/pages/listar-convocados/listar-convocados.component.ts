import { Component } from '@angular/core';
import { ConvocadoService } from '../../services/convocado.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ContratacionService } from '../../services/contratacion.service';
import { Contratacion } from '../../models/contratacion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Convocado } from '../../models/convocado';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExcelExportService } from '../../services/excel-export.service';

@Component({
  selector: 'app-listar-convocados',
  standalone: true,
  imports: [ TableModule, ButtonModule, DialogModule, InputTextModule,
    NgxExtendedPdfViewerModule, ToastModule, TagModule, RouterModule],
  templateUrl: './listar-convocados.component.html',
  styleUrl: './listar-convocados.component.css',
  providers: [MessageService]
})
export class ListarConvocadosComponent {
  columns = ['DNI/RUC', 'Nombres', 'Apellido Paterno', 'Apellido Materno', 'Dirección', 'Correo', 'Teléfono'];
  title = "";
  convocados!: Convocado[];
  contratacion : Contratacion = new Contratacion();
  pdfUrl = '';
  visible = false;
  loading: boolean = true;
  id = 0;
  constructor(private convocadoService: ConvocadoService, 
    private messageService: MessageService,
    private route: ActivatedRoute, 
    private contratacionService: ContratacionService,
    private excelExportService: ExcelExportService
  ) { }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.loading = true;
    this.contratacionService.getContratacionByCodigo(this.id).subscribe((contratacion) => {
      this.contratacion = contratacion;
      this.title = `Postulantes de la convocatoria ${this.contratacion.descripcion} - ${this.contratacion.numeroExpediente}`.toUpperCase()
    });
    this.convocadoService.getConvocados(this.id).subscribe((convocados) => {
      this.convocados = convocados;
      this.loading = false;
    });
  }
  clear(table: Table, textInput: HTMLInputElement) {
    table.clear();
    textInput.value = '';
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Tabla limpiada.' });
  }
  verPdf(url: string) {
    this.visible = true;
    this.pdfUrl = url;
  }
  getSeverity(estado: string) {
    return estado == 'Activo' ? 'success' : 'danger';
  }

  exportPdf() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(14); 
    doc.setFont("helvetica", "bold");
    doc.text(this.title, 14, 20);

    const rows = this.convocados.map(item =>
      [item.dniRuc, item.nombre, item.apellidoPaterno,
      item.apellidoMaterno, item.direccion, item.correo,
      item.telefono]);

    autoTable(doc, {
      startY: 25, 
      head: [this.columns],
      body: rows
    });

    doc.save(`${this.title}.pdf`);
  }
  exportExcel() {
    const data = this.convocados.map(item => [
      item.dniRuc, item.nombre, item.apellidoPaterno,
      item.apellidoMaterno, item.direccion, item.correo,
      item.telefono
    ]);
    this.excelExportService.exportAsExcelFile(data, this.columns, this.title);
  }


}
