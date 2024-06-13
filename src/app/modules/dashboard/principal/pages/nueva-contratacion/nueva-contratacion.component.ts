import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ContratacionService } from '../../services/contratacion.service';
import { Formato } from '../../../mantenimiento/models/formato';
import { FormatoService } from '../../../mantenimiento/services/formato.service';
import { Contratacion } from '../../models/contratacion';
import { Router, RouterModule } from '@angular/router';
import { AccesoService } from '../../../mantenimiento/services/acceso.service';
import { Acceso } from '../../../mantenimiento/models/acceso';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-nueva-contratacion',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule,
    InputTextareaModule, InputTextModule, ReactiveFormsModule,
    DropdownModule, FormsModule, RouterModule,
    FileUploadModule, ToastModule, CalendarModule, ProgressSpinnerModule],
  templateUrl: './nueva-contratacion.component.html',
  styleUrl: './nueva-contratacion.component.css',
  providers: [MessageService]
})
export class NuevaContratacionComponent {
  tipoServicios: any[] = [];
  formatos: Formato[] = [];
  form!: FormGroup;
  acceso !: Acceso;
  today = new Date();
  fileFormato!: File;
  fileConvocatoria!: File;
  mensajeFormato!: string;
  mensajeConvocatoria!: string;
  constructor(
    private router: Router,
    private contratacionService: ContratacionService,
    private formatoService: FormatoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private accesoService: AccesoService
  ) { }

  ngOnInit() {
    this.accesoService.getAccesoActual().subscribe((acceso) => { this.acceso = acceso; });
    this.formatoService.getFormatos().subscribe((formatos) => { this.formatos = formatos; });

    this.form = this.formBuilder.group({
      numeroExpediente: [''/* , [Validators.required] */],
      descripcion: ['', [Validators.required]],
      tipoServicio: ['', [Validators.required]],
      formato: ['', [Validators.required]],
      fechaPublicacion: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
    });

    this.tipoServicios = [
      'Bien',
      'Servicio'
    ];
  }

  descargarFormato() {
    const formatoSeleccionado = this.form.value.formato;
    if (formatoSeleccionado) {
      const url = formatoSeleccionado.url;
      window.open(url, '_blank');
    }
  }

  onUpload() {
    if (this.validarBoton()) {
      if (this.form.value.fechaVencimiento < this.form.value.fechaPublicacion) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de vencimiento no puede ser menor a la fecha de publicación.' });
      } else {
        let uniqueFileName = `${new Date().getTime()}_${this.fileFormato.name}`;
        let contrato: Contratacion = this.form.value;
        let formData = new FormData();
        formData.append('file', this.fileFormato, uniqueFileName);
        this.contratacionService.addContratacionDocument(formData).subscribe((infoFormato: any) => {
          contrato.urlFormato = infoFormato["url"];
          uniqueFileName = `${new Date().getTime()}_${this.fileConvocatoria.name}`;
          formData = new FormData();
          formData.append('file', this.fileConvocatoria, uniqueFileName);
          this.contratacionService.addContratacionDocument(formData).subscribe((infoConvocatoria: any) => {
            contrato.urlConvocatoria = infoConvocatoria["url"];
            //contrato.urlResultado = '';
            contrato.estado = 'Activo';
            contrato.codigoSenamhi = this.acceso.codigoSenamhi;
            contrato.codigoSede = this.acceso.codigoSede;
            contrato.sede = this.acceso.sede;
            contrato.codigoAcceso = this.acceso.codigo;
            this.contratacionService.createContratacion(contrato).subscribe(() => {
              let mensaje = { severity: 'success', summary: 'Éxito', detail: 'Contratación creada correctamente.' };
              localStorage.setItem('mensaje', JSON.stringify(mensaje));
              this.router.navigate(['/dashboard/contrataciones']);
            });
          });
        });
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos.' });
    }
  }
  onSelectFormato(event: FileUploadHandlerEvent) {
    this.fileFormato = event.files[0];
    this.mensajeFormato = ` ${this.fileFormato.name} - ${this.fileFormato.size / 1024} KB`;
  }
  onSelectConvocatoria(event: FileUploadHandlerEvent) {
    this.fileConvocatoria = event.files[0];
    this.mensajeConvocatoria = ` ${this.fileConvocatoria.name} - ${this.fileConvocatoria.size / 1024} KB`;
  }
  validarBoton() {
    return this.form.valid && this.fileFormato && this.fileConvocatoria;
  }
}
