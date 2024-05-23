import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenubarModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  items!: MenuItem[];
  rol = localStorage.getItem('role');
  constructor(private router : Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Principal',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'Registros',
            icon: 'pi pi-file-pdf',
            routerLink: 'contrataciones'
          }
        ]
      },
      {
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout()
      }
    ];

    this.rol == 'ROLE_ADMINISTRADOR' ? this.addAdminItems() : null;
  }

  addAdminItems() {
    this.items.unshift(
      {
        label: 'Mantenimiento',
        icon: 'pi pi-desktop',
        items: [
          {
            label: 'Formatos',
            icon: 'pi pi-file-word',
            routerLink: 'formatos'
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-user-plus',
            routerLink: 'usuarios'
          },
        ]
      }
    );
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
