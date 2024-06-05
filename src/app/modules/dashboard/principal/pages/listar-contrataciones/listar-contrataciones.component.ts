import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ContratacionService } from '../../services/contratacion.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contratacion } from '../../models/contratacion';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-listar-contrataciones',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CalendarModule,
    DialogModule, InputTextModule, TagModule, DropdownModule, RouterModule,
    NgxExtendedPdfViewerModule, ToastModule],
  templateUrl: './listar-contrataciones.component.html',
  styleUrl: './listar-contrataciones.component.css',
  providers: [MessageService]
})
export class ListarContratacionesComponent {
  contrataciones!: any[];
  pdfUrl = ''
  tipoServicios!: any[];
  visible = false;
  isPDF = false;
  estados !: any[];
  loading: boolean = true;
  fechaPubli = new Date().toISOString().split('T')[0];
  fechaVenc = new Date().toISOString().split('T')[0];
  descripcion = '';
  contra = new Contratacion();
  today = new Date().toISOString().split('T')[0];
  constructor(private contratacionService: ContratacionService, private messageService: MessageService) { }

  ngOnInit() {
    this.loading = true;
    this.contratacionService.getContrataciones().subscribe((contrataciones) => {
      this.contrataciones = contrataciones;
      this.loading = false;
    });

    this.tipoServicios = [
      { label: 'Bien', value: 'Bien' },
      { label: 'Servicio', value: 'Servicio' }
    ];
    this.estados = [
      { label: 'Activo', value: 'Activo' },
      { label: 'Inactivo', value: 'Inactivo' }
    ];
  }

  ngAfterViewInit() {
    let mensaje = localStorage.getItem('mensaje');
    if (mensaje) {
      this.messageService.add(JSON.parse(mensaje));
      localStorage.removeItem('mensaje');
    }
  }

  clear(table: Table, textInput: HTMLInputElement) {
    table.clear();
    textInput.value = '';
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Tabla limpiada.' });
  }

  getSeverity(estado: string) {
    return estado == 'Activo' ? 'success' : 'danger';
  }

  noVencido(contratacion: Contratacion) {
    return contratacion.fechaVencimiento >= new Date().toISOString().split('T')[0];
  }

  openDialog(contratacion: Contratacion) {
    if (contratacion.fechaVencimiento >= new Date().toISOString().split('T')[0]) {
      this.visible = true;
      this.contra = contratacion;
      this.fechaPubli = contratacion.fechaPublicacion;
      this.fechaVenc = contratacion.fechaVencimiento;
    }
  }
  updateContratacion() {
    if (this.fechaVenc < this.fechaPubli) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de vencimiento no puede ser menor a la fecha de publicación.' });
    } else {
      this.contra.fechaPublicacion = this.fechaPubli;
      this.contra.fechaVencimiento = this.fechaVenc;
      this.contra.descripcion = this.descripcion;
      this.contratacionService.updateContratacion(this.contra).subscribe(() => {
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contratación actualizada correctamente.' });
      });
    }
  }

  verPdf(url: string) {
    if (url.toLowerCase().endsWith('.pdf')) {
      this.isPDF = true;
      this.pdfUrl = url;
    } else {
      window.open(url, '_blank');
    }
  }
}
