import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { AccesoService } from '../../../services/acceso.service';
import { Acceso } from '../../../models/acceso';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, InputTextModule, RouterModule, ToastModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css',
  providers: [MessageService]
})
export class ListarUsuariosComponent {
  usuarios!: Acceso[];

  loading: boolean = true;
  constructor(private accesoService: AccesoService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
    let mensaje = localStorage.getItem('mensaje');
    if (mensaje) {
      this.messageService.add(JSON.parse(mensaje));
      localStorage.removeItem('mensaje');
    }
  }
  loadData() {
    this.loading = true;
    this.accesoService.getAccesos().subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.loading = false;
    });
  }
  getSeverity(estado: boolean) {
    return estado ? 'success' : 'danger';
  }
  clear(table: Table, textInput: HTMLInputElement) {
    table.clear();
    textInput.value = '';
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Tabla limpiada.' });
  }

  updateEstado(usuario: Acceso, estado: boolean) {
    usuario.estado = estado;
    this.accesoService.updateAcceso(usuario).subscribe(() => {
      this.loadData();
      this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Estado actualizado.' });
    });
  }
  resetContrasenia(usuario: Acceso) {
    usuario.contrasenia = usuario.dni;
    this.accesoService.updateAcceso(usuario).subscribe(() => {
      this.loadData();
      this.messageService.add({ severity: 'warn', summary: 'Éxito', detail: 'Contraseña restablecida a DNI.' });
    });
  }
}
