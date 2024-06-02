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
import { ProveedorService } from '../../services/proveedor.service';
import { Contratacion } from '../../models/contratacion';
import { Router } from '@angular/router';
import { AccesoService } from '../../../mantenimiento/services/acceso.service';
import { Acceso } from '../../../mantenimiento/models/acceso';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-nueva-contratacion',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule,
    InputTextareaModule, InputTextModule, ReactiveFormsModule,
    DropdownModule, FormsModule,
    FileUploadModule, ToastModule, CalendarModule, ProgressSpinnerModule],
  templateUrl: './nueva-contratacion.component.html',
  styleUrl: './nueva-contratacion.component.css',
  providers: [MessageService]
})
export class NuevaContratacionComponent {
  tipoServicios: any[] = [];
  formatos: Formato[] = [];
  readonly: boolean = true;
  form!: FormGroup;
  acceso !: Acceso;
  recargar = true;
  today = new Date();
  constructor(
    private router: Router,
    private contratacionService: ContratacionService,
    private formatoService: FormatoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private proveedorService: ProveedorService,
    private accesoService: AccesoService
  ) { }

  ngOnInit() {
    this.accesoService.getAccesoActual().subscribe((acceso) => { this.acceso = acceso; });
    this.formatoService.getFormatos().subscribe((formatos) => { this.formatos = formatos; });

    this.form = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      tipoServicio: ['', [Validators.required]],
      formato: ['', [Validators.required]],
      fechaPublicacion: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      dniRuc: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
      nombre: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });

    this.tipoServicios = [
      'Bien',
      'Servicio'
    ];
  }

  buscarUsuario() {
    this.proveedorService.getProveedorByDniRuc(this.form.value.dniRuc).subscribe((usuario) => {
      if (usuario) {
        this.form.patchValue({
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          direccion: usuario.direccion,
          telefono: usuario.telefono,
          correo: usuario.correo
        });
      } else {
        this.readonly = false;
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Proveedor no encontrado, complete los datos.' });
      }
    });
  }

  descargarFormato() {
    const formatoSeleccionado = this.form.value.formato;
    if (formatoSeleccionado) {
      const url = formatoSeleccionado.url;
      window.open(url, '_blank');
    }
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    this.recargar = false;
    if (file && this.form.valid) {
      if (this.form.value.fechaVencimiento < this.form.value.fechaPublicacion) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de vencimiento no puede ser menor a la fecha de publicación.' });
      } else {
        const uniqueFileName = `${new Date().getTime()}_${file.name}`;
        let contrato: Contratacion = this.form.value;
        let formData = new FormData();
        formData.append('file', file, uniqueFileName);
        this.contratacionService.addContratacionDocument(formData).subscribe((info: any) => {
          contrato.url = info["url"];
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
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos.' });
    }
  }
  salir() {
    if (this.recargar) {
      this.router.navigate(['/dashboard/contrataciones']);
    } else {
      this.recargar = true;
    }
  }
}
