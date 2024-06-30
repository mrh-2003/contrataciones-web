import { ChangeDetectorRef, Component } from '@angular/core';
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
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
@Component({
  selector: 'app-listar-contrataciones',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CalendarModule,
    DialogModule, InputTextModule, TagModule, DropdownModule, RouterModule,
    NgxExtendedPdfViewerModule, ToastModule, InputTextareaModule, FileUploadModule],
  templateUrl: './listar-contrataciones.component.html',
  styleUrl: './listar-contrataciones.component.css',
  providers: [MessageService]
})
export class ListarContratacionesComponent {
  contrataciones!: any[];
  sedes!: any[];
  pdfUrl = ''
  tipoServicios!: any[];
  visible = false;
  isPDF = false;
  siResultado = false;
  estados !: any[];
  loading: boolean = true;
  file !: File;
  fechaPubli = new Date();
  fechaVenc = new Date();
  descripcion = '';
  contra = new Contratacion();
  today = new Date();
  mensaje = '';
  constructor(private contratacionService: ContratacionService, private messageService: MessageService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.loading = true;
    this.contratacionService.getContrataciones().subscribe((contrataciones) => {
      this.contrataciones = contrataciones;
      this.loading = false;
    });
    this.primengConfig.setTranslation({
      accept: 'Aceptar',
      reject: 'Cancelar',
      firstDayOfWeek: 1,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
      dayNamesMin: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
        'Noviembre', 'Diciembre'],
      monthNamesShort: ['E', 'F', 'Mz', 'Ab', 'My', 'Jn', 'Jl', 'Ag', 'S', 'O', 'N', 'D'],
      today: 'Hoy',
      clear: 'Reiniciar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Semana'
    });
    this.tipoServicios = [
      { label: 'Bien', value: 'Bien' },
      { label: 'Servicio', value: 'Servicio' }
    ];
    this.estados = [
      { label: 'Activo', value: 'Activo' },
      { label: 'Finalizado', value: 'Finalizado' }
    ];
    this.sedes = [
      { label: 'Central', value: 'Central' },
      { label: 'Dirección Zonal', value: 'Dirección Zonal' }
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
    
    this.contra = contratacion;
    if (contratacion.fechaVencimiento >= new Date().toISOString().split('T')[0]) {
      this.visible = true;
      let publi = contratacion.fechaPublicacion.split('-');
      let venc = contratacion.fechaVencimiento.split('-');
      this.fechaPubli = new Date(`${publi[1]}/${publi[2]}/${publi[0]}`);
      this.fechaVenc = new Date(`${venc[1]}/${venc[2]}/${venc[0]}`);
      this.descripcion = contratacion.descripcion;
    } 
  }
  updateContratacion() {
    if (this.fechaVenc < this.fechaPubli) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de vencimiento no puede ser menor a la fecha de publicación.' });
    } else {
      this.contra.fechaPublicacion = this.fechaPubli.toISOString().split('T')[0];
      this.contra.fechaVencimiento = this.fechaVenc.toISOString().split('T')[0];
      this.contra.descripcion = this.descripcion;
      this.contratacionService.updateContratacion(this.contra).subscribe(() => {
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contratación actualizada correctamente.' });
      });
    }
  }
  updateResultado(){
    if(this.file){
      const uniqueFileName = `${new Date().getTime()}_${this.file.name}`;
      const formData = new FormData();
      formData.append('file', this.file, uniqueFileName);
      this.contratacionService.addContratacionDocument(formData).subscribe((infoResultado: any) => {
        this.contra.urlResultado = infoResultado["url"];
        this.contra.estado = 'Finalizado';
        this.contratacionService.updateContratacion(this.contra).subscribe(() => {
          this.siResultado = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Resultado subido correctamente.' });
        });
      });
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un archivo.' });
    }
  }
  subirResultados(contratacion: Contratacion){
    this.contra = contratacion;
    this.siResultado = true;
  }
  onSubmit(event: FileUploadHandlerEvent){
    this.file = event.files[0];
    this.mensaje = ` ${this.file.name} - ${this.file.size / 1024} KB`;
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
