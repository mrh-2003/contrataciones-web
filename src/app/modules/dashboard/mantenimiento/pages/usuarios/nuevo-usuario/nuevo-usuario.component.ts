import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccesoService } from '../../../services/acceso.service';
import { Acceso } from '../../../models/acceso';
import { TrabajadorService } from '../../../services/trabajador.service';
import { DropdownModule } from 'primeng/dropdown';
import { Trabajador } from '../../../models/trabajador';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [CardModule, ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule, DropdownModule, ToastModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css',
  providers: [MessageService]
})
export class NuevoUsuarioComponent {
  form !: FormGroup;
  roles: any[] = [];
  readonly: boolean = true;
  constructor(
    private trabajadorService: TrabajadorService,
    private accesoService: AccesoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.roles = ['ADMINISTRADOR', 'PERSONAL LOGISTICO'];
    this.form = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      usuario: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombre: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      codigoSenamhi: [''],
      codigoCargo: [''],
      codigoSede: [''],
      sede: ['']
    });
  }

  buscarUsuario() {
    this.trabajadorService.getTrabajadorByDni(this.form.value.dni).subscribe((usuario) => {
      if (usuario) {
        this.form.patchValue({
          dni: usuario.dni,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          cargo: usuario.cargo,
          codigoSenamhi: usuario.codigoSenamhi,
          codigoCargo: usuario.codigoCargo,
          codigoSede: usuario.codigoSede,
          sede: usuario.sede
        });
      } else {
        this.readonly = false;
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Usuario no encontrado, complete los datos.' });
      }
    });
  }

  onSubmit() {
    let acceso: Acceso = {
      codigo: 0,
      dni: this.form.value.dni,
      nombres: this.form.value.nombre + ' ' + this.form.value.apellidoPaterno + ' ' + this.form.value.apellidoMaterno,
      cargo: this.form.value.cargo,
      codigoSenamhi: this.form.value.codigoSenamhi,
      usuario: this.form.value.usuario,
      contrasenia: this.form.value.contrasenia,
      fechaCreacion: '',
      estado: true,
      rol: this.form.value.rol,
      codigoCargo: this.form.value.codigoCargo,
      codigoSede: this.form.value.codigoSede,
      sede: this.form.value.sede
    }

    if (!this.readonly) {
      let trabajador: Trabajador = {
        codigo: 0,
        dni: this.form.value.dni,
        nombre: this.form.value.nombre,
        apellidoPaterno: this.form.value.apellidoPaterno,
        apellidoMaterno: this.form.value.apellidoMaterno,
        cargo: this.form.value.cargo,
        codigoSenamhi: '000',
        codigoCargo: '000',
        codigoSede: '001',
        sede: 'Lima'
      };
      acceso.codigoSenamhi = trabajador.codigoSenamhi;
      acceso.codigoCargo = trabajador.codigoCargo;
      acceso.codigoSede = trabajador.codigoSede;
      acceso.sede = trabajador.sede;
      this.trabajadorService.addTrabajador(trabajador).subscribe(() => { });
    }

    this.accesoService.createAcceso(acceso).subscribe(() => {
      let mensaje = { severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.' }
      localStorage.setItem('mensaje', JSON.stringify(mensaje));
      this.router.navigate(['/dashboard/usuarios']);
    });
  }

}
