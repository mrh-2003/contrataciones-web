import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ListarUsuariosComponent } from './modules/dashboard/mantenimiento/pages/usuarios/listar-usuarios/listar-usuarios.component';
import { NuevoUsuarioComponent } from './modules/dashboard/mantenimiento/pages/usuarios/nuevo-usuario/nuevo-usuario.component';
import { NuevoFormatoComponent } from './modules/dashboard/mantenimiento/pages/formatos/nuevo-formato/nuevo-formato.component';
import { ListarFormatoComponent } from './modules/dashboard/mantenimiento/pages/formatos/listar-formato/listar-formato.component';
import { ListarContratacionesComponent } from './modules/dashboard/principal/pages/listar-contrataciones/listar-contrataciones.component';
import { NuevaContratacionComponent } from './modules/dashboard/principal/pages/nueva-contratacion/nueva-contratacion.component';
import { authGuard } from './modules/auth/guards/auth.guard';
import { adminGuard } from './modules/dashboard/mantenimiento/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] , children: [
        {path: 'usuarios', component: ListarUsuariosComponent, canActivate: [adminGuard]},
        {path: 'usuarios/nuevo', component: NuevoUsuarioComponent, canActivate: [adminGuard]},
        {path: 'formatos', component: ListarFormatoComponent, canActivate: [adminGuard]},
        {path: 'formatos/nuevo', component: NuevoFormatoComponent, canActivate: [adminGuard]},
        {path: 'formatos/editar/:id', component: NuevoFormatoComponent, canActivate: [adminGuard]},
        {path: 'contrataciones', component: ListarContratacionesComponent},
        {path: 'contrataciones/nuevo', component: NuevaContratacionComponent}    
    ]},
    { path: '**', redirectTo: 'login', pathMatch: 'full' }

];
