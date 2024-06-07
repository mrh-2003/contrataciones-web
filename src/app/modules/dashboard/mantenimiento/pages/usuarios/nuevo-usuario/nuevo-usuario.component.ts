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
import { Respuesta } from '../../../models/respuesta';

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
    this.trabajadorService.getTrabajadorByDni(this.form.value.dni).subscribe({
      next: (resp: Respuesta) => {
        let usuario = resp.listPersonal[0];
        if (usuario) {
          this.form.patchValue({
            dni: usuario.dni,
            nombre: usuario.nombre,
            apellidoPaterno: usuario.apePaterno,
            apellidoMaterno: usuario.apeMaterno,
            cargo: usuario.cargo,
            codigoSenamhi: usuario.codigoEmpleado,
            codigoCargo: usuario.codigoCargo,
            codigoSede: usuario.codigoZonal,
            sede: usuario.zonal
          });
        } else {
          this.readonly = false;
          this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Usuario no encontrado, complete los datos.' });
        }
      },
      error: (error) => {
        this.readonly = false;
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
        dni: this.form.value.dni,
        nombre: this.form.value.nombre,
        apePaterno: this.form.value.apellidoPaterno,
        apeMaterno: this.form.value.apellidoMaterno,
        cargo: this.form.value.cargo,
        codigoEmpleado: '000',
        codigoCargo: '000',
        codigoZonal: '001',
        zonal: 'Lima'
      };
      acceso.codigoSenamhi = trabajador.codigoEmpleado;
      acceso.codigoCargo = trabajador.codigoCargo;
      acceso.codigoSede = trabajador.codigoZonal;
      acceso.sede = trabajador.zonal;
      this.trabajadorService.addTrabajador(trabajador).subscribe(() => { });
    }

    this.accesoService.createAcceso(acceso).subscribe(() => {
      let mensaje = { severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.' }
      localStorage.setItem('mensaje', JSON.stringify(mensaje));
      this.router.navigate(['/dashboard/usuarios']);
    });
  }

}
